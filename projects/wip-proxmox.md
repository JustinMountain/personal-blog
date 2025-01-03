---
title: 'Proxmox'
featured: 'no'
published: 'no'
updated: ''
repo: ''
category: 'documentation'
tags: 'linux, homelab, data management'
excerpt: 'Ensuring a proper backup strategy is an important part of a digital life.'
excerpt2: ''
thumbnail: ''
thumbalt: ''
---

### Table of Contents

# Proxmox Setup

## Boot

I used two 250gb drives in a zfs RAID1 mirror

## Post Installation

BIOS Settings

Run the `Proxmox VE Post Install` and `Proxmox VE CPU Scaling Governor` scripts from `https://community-scripts.github.io/ProxmoxVE/scripts`.

NVMe Pool:
1. Mirror
1. Compression `lz4`

## Enabling PCIe Passthrough

### Update the GRUB Bootloader

`nano /etc/default/grub`

Change `GRUB_CMDLINE_LINUX_DEFAULT="quiet"`
to `GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt"`

`update-grub`

`reboot`

Validate with `dmesg | grep -e DMAR -e IOMMU`

### Update Kernel Modeules

`nano /etc/modules`

```
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd
```

`update-initramfs -u -k all`

`reboot`

Validate with `dmesg | grep -i vfio`

## TrueNAS VM

Download the TrueNAS Scale ISO from `https://www.truenas.com/download-truenas-scale/`

SATA Passthrough
Shares for:
1. Media
1. Photos
1. Backups (Documents, VMs)

```
Craft Computing Proxmox 8.0 - PCIe Passthrough
```

System:
Machine: q35
BIOS: OVMF (UEFI)
EFI Storage: nvme

CPU:
4 Cores
Type x86-64-v2-AES (default)

Memory:
8192 MiB 
Ballooning turned off (required for passthrough)

Create VM, turn on, 

At the beginning of the startup it will say `Startup boot options`, press `Esc`. 

Device Manager > Secure Boot Configuration > Attempt Secure Boot (turn off)

F10 to save, Y to confirm

This will open a boot menu where we need to turn off Secure Boot. This is required for UEFI BIOS to work. 

install TrueNAS

`username: truenas_admin`

`shutdown`

Add > PCI Device > Raw Device > Choose the SATA Controller, Check `PCI-Express`

### Set Static IP

Go to the Network tab

Find the interface and Uncheck DHCP

Add an Alias with the desired IP

Add gateway when prompted

Reboot the VM, and it should now be accessible at the new IP (Can confirm via console, or the WebUI)


### Create an SMB Share

1. Create a Pool
`Storage > Create Pool`

I chose a Mirrored VDEV for my 2 8TB drives and turned on Encryption. I can expand the pool after buying two more 8TB drives by going to:

`Storage > DataStore > Manage Devices > Add VDEV`

1. Create Datasets

`Datasets > DataStore`

I created different directories for each category of share (backups, documents, entertainment, photos, etc)

1. Create Users

`Credentials > Users`

Give the user the group `builtin_administrator` or make a new group for them then add ACL accordingly under `Shares > share_name > Edit Filesystem ACL`

1. Create Shares

`Shares > Windows (SMB) Shares > Add`

I created a share point for each Dataset.

After creation, configure ACL and make sure to check if the new group has been added (as above) or add the user/group.

Select `Save Access Control List`



## Windows VM

Downlaod the Windows ISO from `https://www.microsoft.com/en-us/software-download/windows11`
Download the latest Windows VirtIO Drivers from `https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers#Using_the_ISO`

### Disabling GPU Drivers from Host

`lspci -nn` on host shell to find device id (looks like `01:00.0`) and device hex code (looks like `1a2b:3c4d`)

Verify the hex code with `lspci -n -s 01:00.0`


`10de:21c4`
`10de:1aeb`
`10de:1aec`
`10de:1aed`

`echo "options vfio-pci ids=10de:21c4,10de:1aeb,10de:1aec,10de:1aed disable_vga=1" > /etc/modprobe.d/vfio.conf`



```
echo "options vfio-pci ids=####.####,####.#### disable_vga=1" > /etc/modprobe.d/vfio.conf # Can replace as many as necessary
echo "blacklist nouveau" >> /etc/modprobe.d/blacklist.conf
echo "blacklist nvidia*" >> /etc/modprobe.d/blacklist.conf
update-initramfs -u -k all
reboot
```

### Creating the VM

OS:
Guest OS: Microsoft Windows
Check `Add additional drive for VirtIO drivers` and select the right ISO

System:
SCSI Controller: VirtIO SCSI single
Machine: q35
BIOS: OVMF (UEFI)
EFI Storage: nvme
Add TPM
TPM Storage: nvme
Version: v2.0

Disks: 
Bus/Device: VirtIO Block

CPU:
Type: Host

Before turning on the VM, go to Hardware > Add > PCI Device 

Check `Raw Device` and find the GPU. Check `All Functions`, `ROM-Bar`, and `PCI-Express` 

In the Host Shell in Proxmox, type `lsusb` to output all of the USB devices and find the hardware ID of the Bluetooth controller.

Then go to the Windows VM in Proxmox and again go to Hardware > Add > USB Device

Select `Use USB Vendor/Device ID` and choose the Device ID found above to pass through the Bluetooth controller.


### Setting Up Windows

I don't have a product key

Windows 11 Pro

When choosing boot media, we need to add drivers:
```
Load Driver > Browse > VirtIO ISO > amd64 > w10

Click on the driver, then click Install 
```

Let's also add network drivers:
```
Load Driver > Browse > VirtIO ISO > NetKVM > w10 > amd64

```

When prompted to name the device:

Go back to VM Hardware tab > Netwrok Device > Edit > Check Disconnect

`Shift + F10` after the first reboot (network connection) 
In the command prompt type `oobe\bypassnro`

Once the install is complete, open VirtIO ISO and scroll down to `virtio-win-gt-x64` to instsll the rest of the drivers.

Activated Windows via `https://github.com/massgravel/Microsoft-Activation-Scripts`

Turn on Remote Desktop

Add or Remove Programs, start menu cleanup

System > Power
then change settings to optimize efficiencies

Find and install Bluetooth drivers for the card, if it didn't happen automatically.

Download:
1. Firefox
1. 7zip
1. Winaero Tweaker

Manually set IP address and dns info

I disabled `Hardware > Display` so Sunshine would work properly


## Development VM (Ubuntu)

Download the Ubuntu Server ISO from `https://ubuntu.com/download/server`

I followed my `wip-node-server` project to create the VM

`sudo apt update && sudo apt upgrade -y`

Setup Python and Ansible (specifically NOT using Running Ansible in my Homelab: Installing Ansible)

```
# Used these commands
sudo apt install python3-pip
sudo apt install ansible-core

# Used to install Docker
ansible-galaxy role install geerlingguy.docker
```

Must run `sudo apt install sshpass` per Running Ansible in my Homelab: Setting Uo an Inventory

Make a new key for `ansible` via:
Running Ansible in my Homelab: Automating Key-Based Authentication

--- Up to here is `setup-complete` snapshot

Create a vault password like Running Ansible in my Homelab: Using Ansible Vault to Store Passwords
For both ansible_ssh_pass.yml and ansible_become_pass.yml

I created an SSH key (called `proxmox-win11` on the machine)
I then copied it to ~/.ssh/proxmox-win11.pub with `scp C:\Users\Justin/.ssh/proxmox-win11.pub justin@192.168.x.x:/home/justin/.ssh/proxmox-win11.pub`


Update current IP at `inventory/hosts`
Update desired IP at `ansible/playbooks/init/group_vars/server_setup_proxmox.yml`


Run `ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/init/server-setup-proxmox-ubuntu24.04.yml --ask-vault-pass` to run the init playbook
This installs Docker and moves the SSH keys

Now I can SSH from the proxmox-win11 machine with `ssh -i 'C:\Users\Justin/.ssh/proxmox-win11' justin@192.168.1.121`

--- Uo to here is `ansible-init` snapshot


The use Ansible to Install:
1. Terraform
1. Code Server


1. Create TrueNAS Share
1. Mount TrueNAS to VM to start transferring files
1. Setup Servarr stack in new VM
1. Setup Services stack in new VM

1. Multiple docker networks and traefik - Jim's Garage has a video somewhere




### Connecting an NFS Share

First, enable permissions in NAS software for the IP to access the share.

```
# Create the mount point
sudo apt-get install nfs-common
sudo mkdir /mnt/nfsshare

# Test the mount
sudo mount -t nfs -o rw,nfsvers=4 server_ip:/shared/directory /mnt/nfsshare

# Make permanent via fstab
server_ip:/shared/directory /mnt/nfsshare nfs rw,nfsvers=4 0 0
```



## Sandbox VM

For deployment testing

## Servarr

## Services

## Bonus Gaming on Linux

Download the Ubuntu Desktop ISO from `https://ubuntu.com/download/desktop`

## Sources

Jim's Garage 2 gpus
Craft Computing Proxmox 8.0 - PCIe Passthrough
Virtualize Windows 11 with Proxmox the Right Way!
Proxmox GPU Passthrough: The Ultimate Guide for Windows VMs! - Barmine Tech


StegosaurNAS
LXC Candidates
1. 101 PiHole (After old NAS is decomm'd)

1. 112 TrueNAS
1. 113 Proxmox Backup Server?

Tyrannoserver
LXC Candidates
1. 100 PiHole
1. 102 Unbound
1. 103 Wireguard
1. 105 Jellyfin

1. 111 TrueNAS (SATA)

1. 121 Dev
1. 122 Sandbox

1. 131 Servarr
1. 132 Services (iGPU)

1. 141 Windows (GPU, Bluetooth Card)
1. 142 Linux (GPU, Bluetooth Card)





### Notes

`eval "$(ssh-agent -s)"`
`ssh-add ~/.ssh/private_key`





## Old

### Steps to Setup a VM


#### Init new VM in Proxmox GUI

> Make sure to note the DHCP-given IP address

- Turn off "Set up this disk as an LVM group"
- Setup extra drives if necessary/mounted in proxmox when prompted
  - Confirm drive mounts via `lsblk -f` and `sudo fdisk -l`
- Install OpenSSH server    
- sudo apt update && sudo apt upgrade -y

#### Setup with Ansible

1. Under `ansible/inventory/hosts` place the DHCP IP address under `server_setup_proxmox`
2. In `ansible/playbooks/init/group_vars/server_setup_promox.yml`, update the desired IP and user info from the setup process.
3. ssh to server at its DHCP address or otherwise add host's fingerprint to your known_hosts file
4. Run `ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/init/server-setup-proxmox-ubuntu2404.yml --ask-vault-pass`

#### SSH Connection with VSCode

I had to copy the SSH key from WSL `\\wsl.localhost\Ubuntu\home\wsl\.ssh` to my Windows user at `C:\Users\Justin\.ssh`, then run `ssh-add admin` from `C:\Users\Justin\.ssh` in the terminal.

Once I did this, I could add the following to my ssh `config` file:

```
Host server-name
  HostName 192.168.1.245
  User justin
  IdentityFile /mnt/c/Users/Justin/.ssh/admin
```

And finally, I can connect to the remote server over SSH in VS Code.

### Automation

Figure out a way to automate the maintenence of VMs:

1. Deleting unused docker images
2. update/upgrade
3. Output logs for drive capacity

### Running a Node Development Server in Proxmox

#### Steps

1. Install VM A La Proxmox tutorial
2. Install Node (https://snapcraft.io/install/node/ubuntu)
3. Install Next.js (https://nextjs.org/docs/getting-started/installation)
4. Install Git (https://git-scm.com/download/linux)
5. Setup Git username (https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address) and email (https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git)
6. Install GitHub CLI Tool (https://github.com/cli/cli/blob/trunk/docs/install_linux.md)
7. Cache credentials (https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git)


I may need to redo `gh auth login` step and generate a new token. I set the current one to expire in 7 days

8. git clone <repo>

9. Add server to Putty? 

9. Install Code Server via docker

#### Commands

Run the server on localhost for development:
```
npm run dev
```

Build the project for production:
```
npm run build
```

Start the server for production:
```
npm run start
```

### Notes

#### Jellyfin LXC

Create a priv LXC
Under options turn on SMB (or NFS)
`apt update && apt upgrade -y`
From (https://jellyfin.org/docs/general/installation/linux) use `wget -O- https://repo.jellyfin.org/install-debuntu.sh | bash`

LXC on Proxmox: https://jellyfin.org/docs/general/administration/hardware-acceleration/intel#lxc-on-proxmox
I didn't do passthrough


Mount SMB Shares:

```
mkdir -p /mnt/truenas/entertainment
sudo mount -t cifs //192.168.1.111/entertainment /mnt/truenas/entertainment -o username=jellyfin,password=password 0 0
password
# Add to fstab
//192.168.1.111/entertainment /mnt/truenas/entertainment cifs username=jellyfin,password=password 0 0

```


