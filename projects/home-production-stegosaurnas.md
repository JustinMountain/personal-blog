---
title: 'A New Home Production Server: StegosaurNAS'
featured: 'no'
published: '2025-02-03'
updated: ''
repo: ''
category: 'documentation'
tags: 'linux, homelab, data management, proxmox, truenas, hardware'
excerpt: 'Using Proxmox, I built a dedicated server to store my family files, photos, and services: StegosaurNAS.'
excerpt2: 'This documentation outlines how to configure Proxmox for PCIe passthrough, and how to install TrueNAS and Ubuntu server as virual machines.'
thumbnail: 'stegosaurnas.jpg'
thumbalt: ''
---

### Table of Contents

### Parts List

1. 1x RackChoice 2U Rackmount Server Chassis
1. 1x Topton N5105 NAS MOBO Mini ITX 
1. 2x 16GB SAMSUNG Memory DDR4 SODIMM RAM 
1. 2x Kingston 240GB A400 SATA 3 2.5 inch Internal SSD
1. 1x ASM1166 M.2 PCIE to 6x SATA Expansion Card 
1. 1x MSI MAG A550BN Gaming Power Supply
1. 2x 8TB Seagate IronWolf Pro 
1. 2x 8TB Seagate IronWolf 
1. 3x Noctua NF-R8 80mm Case Fans
1. 1x Noctua NF-A4x10 40mm Case Fan
1. 1x Noctua NA-SYC1 Fan Cable Y-Splitter

### 👨‍💻 What is Proxmox?

Proxmox Virtual Environment is my hypervisor of choice, allowing me to virtualize workloads in my homelab. I've used it in previous projects and will continue to use it here. Proxmox is based on Linux and can be installed just like any other operating system. That being said, however, I always go into the BIOS when setting up Proxmox on a new machine. Before installing, I always make sure that VT-d and SR-IOV are turned on, as they are required for the host to be able to do hardware virtualization, and I also enable any ASPM settings in order to allow device-level power management.

> Hardware virtualization requires VT-x (Intel) or AMD-V (AMD), check your motherboard before changing any settings.

#### 💽 Installing Proxmox

Setting up Proxmox is as simple as creating a bootable USB drive, plugging it into the system, and telling the system to boot from USB. The process is relatively straight-forward and plugging in to the network will populate DHCP and DNS settings automatically, though they can be changed during setup.

Apart from changing to a static IP, the only major thing to note during setup is that I like to use a zfs RAID1 mirror for the boot drive. This is mostly because I want a little extra protection from drive failure than exclusively using backups.

For StegosaurNAS, there is no dedicated NVMe drive for VMs to sit on. I decided that it wasn't too important to have the extra performance of NVMe since: 

1) There won't be many VMs running on StegosaurNAS
1) None of the processes will require optimized IOPS. 

I setup the zfs RAID1 mirror with two 500gb drives, which should be more than enough for my VMs and local storage. I explictly setup this configuration and told Proxmox to ignore the other 4 drives, since they will be passed through to a TrueNAS virtual machine via a dedicated SATA controller (see below). 

Once the installation has completed, the Proxmox UI is available over port `8006`.

#### ⌨️ Post Installation Scripts

There are a collection of [community scripts](https://community-scripts.github.io/ProxmoxVE/scripts) that are often linked/referenced around the internet and I used two of them on StegosaurNAS, `Proxmox VE Post Install` and `Proxmox VE CPU Scaling Governor`. These two scripts help take care of a bunch of housekeeping things like enabling the non-subscription repo and the nag on login, among other things.

> Trust but verify: read and re-read scripts found on the internet before running them.

#### 🪪 Enabling PCIe Passthrough

With Proxmox generally setup, there are a few extra things to do in order to allow PCIe passthrough to our virtual machines. By enabling PCIe passthrough and giving the VMs direct access to the devices, devices act as if they are physically attached to the virtual machines instead of the host. This direct access has less overhead, improved I/O performance, minor security improvement due to isolation, and enables better GPU support for VMs.

First, we need to update the GRUB bootloader by accessing the grub file at `nano /etc/default/grub`:

```
# Change 
GRUB_CMDLINE_LINUX_DEFAULT="quiet"

# to
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt"
```

With the changes to the file saved, run `update-grub` and then `reboot` the server to make sure the changes propogate. This step can be validated by running `dmesg | grep -e DMAR -e IOMMU` in the host shell and looking for a line that says `enabled`.

With the bootloader updated, we need to update the kernel so that a few extra modules will load at boot. Start by opening `nano /etc/modules` and adding the following modules to the end of the file:

```
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd
```

Once the modules have been added and the file saved, run `update-initramfs -u -k all` and then `reboot` the server. Like above, these changes can be validated by running `dmesg | grep -e DMAR -e IOMMU -e AMD-Vi` and looking for "Remapping enabled" in the output. 

At this point, devices can be passed to the Virtual Machine by going to the **Hardware** tab for the VM in the interface and going to **Add** > **PCI Device**, then selecting the correct device under **Raw Device**. 

Devices that are in unique IOMMU groups should pass without issue into the virtual machine. I have not been able to find a way to pass items in shared IOMMU groups, like the iGPU, through to a vm (though I think it's possible). 

#### 🤖 Disabling (GPU) Drivers from Host

Sometimes it's necessary to disable the drivers from the host, preventing them from loading at all. 

In order to pass my GPU to a VM, I needed to disable all of its functions from loading. First, I used `lspci -nn` in the host shell to find device ids (looks like `01:00.0`) and device hex code (looks like `1a2b:3c4d`) that need to be disabled. We can then verify the hex code with `lspci -n -s 01:00.0`.

My 1660 Super had four different devices that needed to be disabled. These four ids were added in a comma-separated list and piped into a `vfio.conf` file:

```
echo "options vfio-pci ids=10de:21c4,10de:1aeb,10de:1aec,10de:1aed disable_vga=1" > /etc/modprobe.d/vfio.conf
```

Additionally, I blacklisted the GPU drivers: 

```
echo "blacklist nouveau" >> /etc/modprobe.d/blacklist.conf
echo "blacklist nvidia*" >> /etc/modprobe.d/blacklist.conf
```

Then I ran `update-initramfs -u -k all` and `reboot` the system.

When selecting the GPU for passthrough as described above, just select the top-level device for passthrough. The rest of the devices are extras, like the sound controller, and they will come along with the root device. 

### 🫙 VMs and Containers

To add ISO images to Proxmox, click on the **local (nodename)** storage option under the correct node in the UI. From here, click on **ISO Images** and **Upload**.

Container Templates are similarly added by clicking on **CT Templates** and **Upload** or by going to **Templates** to find templates for common distributions. 

#### 💾 TrueNAS VM

Download the TrueNAS Scale ISO from `https://www.truenas.com/download-truenas-scale/`

Here are the settings I used when setting up the TrueNAS VM in Proxmox `8.3.3`:

```
System:
Machine: q35
BIOS: OVMF (UEFI)

CPU:
4 Cores
Type x86-64-v2-AES (default)

Memory:
8192 MiB 
Ballooning turned off (required for passthrough)
```

Under the `Console` tab in the UI, press `Esc` on the startup screen when the VM is turned on when it says `Startup boot options`. In this menu go to **Device Manager** and select **Secure Boot Configuration** and turn off **Attempt Secure Boot**. Press `F10` to save and `Y` to confirm. Turning off Secure Boot is required for UEFI BIOS to work. 

Once the truenas install has completed, shutdown the device and in the Promox UI, and add any dedicated SATA controllers as described above. 

With the TrueNAS VM turned on, the `Console` will show its current IP address. Access the VM over port 80 at the IP seen in the console.

##### 📍 Setting a Static IP

Under the **Network** tab, find the interface and Uncheck **DHCP**. Then add an Alias with the desired IP and subnet mask. Once saved, a prompt will appear asking for the gateway address.

After rebooting the VM, the TrueNAS UI should be available at the new IP. The new IP will also be in the `Console` tab of the Proxmox UI.

##### 📨 Sharing Data

Now that TrueNAS is available over a static IP and in control of the SATA card, it's time to add a share.

First, I needed to create a zfs pool for the data by going to the **Storage** tab, and selecting **Create Pool**. I chose to use a Mirrored VDEV for my 2 8TB drives, giving me 8TB of space with complete redundancy. 

I later expanded the pool after buying two more 8TB drives by selecting **Manage Devices** under the **Storage** tab and then selecting **Add VDEV**.

With the pool created and the **Datasets** tab open, click **Add Dataset** to create different share directories. I setup four: backups, documents, entertainment, and photos.

Next, I needed to create users that have access to the data. Select the **Credentials** then **Users** tab and give the user the `builtin_administrator` group or make a new group for them then add ACL accordingly under **Shares** > **share_name** > **Edit Filesystem ACL**. I always check **Apply permissions recursively** and don't forget to **Save Access Control List**.

Finally, shares can now be made and given to users! SMB and NFS shares can be made separately and to point towards the same directories. After creating a new share, I always like to configure the ACL and make sure to check if the new group has been added (as above) and manually add the user/group, if necessary.

#### 🐧 Ubuntu Server

After downloading the Ubuntu Server ISO from `https://ubuntu.com/download/server` and uploading it to Proxmox, installation is straight forward. I like to make a few edits to the default installation:

1. On **Guided storage configuration** select *Use an entire disk* and de-select *Set up this disk as an LVM group*, if applicable; this type of balooning is already being taken care of by Proxmox
1. Select *Install OpenSSH server*
1. Skip all optional snap packages

Once the installation has completed, any extra drives that were mounted during the process can be confirmed with `lsblk -f` and `sudo fdisk -l`, and it's always a good idea to run `sudo apt update && sudo apt upgrade -y`.

At this stage, I have an Ansible playbook setup to initialize Ubuntu 24.04 servers to a consistent state [link](enter a link here). 

Under `ansible/inventory/hosts` I put the DHCP-given IP address under `server_setup_proxmox`.

In `ansible/playbooks/init/group_vars/server_setup_promox.yml`, update the desired IP and user info from the setup process.

Then, I `ssh` to the server at its DHCP address to add the fingerprint, but you can also manually add it to the `known_hosts` file.

From the root directory of the repository above, run `ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/init/server-setup-proxmox-ubuntu2404.yml --ask-vault-pass` and wait until Ansible is done setting up the Ubuntu server just the way I like it.
