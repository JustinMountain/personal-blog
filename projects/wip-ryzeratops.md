---
title: 'Ryzeratops'
featured: 'no'
published: 'no'
updated: ''
repo: ''
category: 'documentation'
tags: 'linux, homelab, data management'
excerpt: 'Proxmox Virtual Environment is my hypervisor of choice, allowing me to virtualize workloads in my homelab.'
excerpt2: 'This documentation outlines how I setup Proxmox on my new dedicated server, StegosaurNAS.'
thumbnail: ''
thumbalt: ''
---

### Table of Contents

### Plan

Preparation:
1. Take SSH keys from Win11 and discover process to import them to new machines
  1. Need to push to tamy, win11vm, and devbuntu
1. Use/write playbook to add SSH keys 
1. `git push`

TrueNAS VM with 2 3tb drives for backup location
1. Is it possible to pass the drives to TrueNAS?
1. This becomes a backup target for other TrueNAS (rsync?)

Heavy Services VM
1. GPU Passthrough for AI learning
1. GitLab
1. Immich Machine Learning
1. Code Server (I need to build an image that contains Ansible and Terraform)

Gaming VM
1. Windows?
1. Linux?

#### Windows VM

Downlaod the Windows ISO from `https://www.microsoft.com/en-us/software-download/windows11`
Download the latest Windows VirtIO Drivers from `https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers#Using_the_ISO`

##### Creating the VM

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


##### Setting Up Windows

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

Turn on the network device in Hardware tab

Activated Windows via `https://github.com/massgravel/Microsoft-Activation-Scripts`

Turn on Remote Desktop

Add or Remove Programs, start menu cleanup

System > Power
then change settings to optimize efficiencies

Find and install Bluetooth drivers for the card, if it didn't happen automatically.

Download:
1. Firefox
1. 7zip
1. paint.net
1. vlc


Manually set IP address and dns info

I disabled `Hardware > Display` so Sunshine would work properly

#### Jellyfin LXC

Create a priv LXC
Under options turn on SMB (or NFS)
`apt update && apt upgrade -y`
From (https://jellyfin.org/docs/general/installation/linux) use `wget -O- https://repo.jellyfin.org/install-debuntu.sh | bash`

LXC on Proxmox: https://jellyfin.org/docs/general/administration/hardware-acceleration/intel#lxc-on-proxmox
I didn't do passthrough


Mount SMB Shares:

```
sudo apt install cifs-utils

sudo mkdir -p /mnt/truenas/entertainment

sudo mount -t cifs //192.168.1.111/entertainment /mnt/truenas/entertainment -o username=jellyfin,password=password


# Add to fstab
//192.168.1.111/entertainment /mnt/truenas/entertainment cifs username=jellyfin,password=password 0 0

```


#### Ubuntu Server

##### Dev Environment

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







#### Bonus Gaming on Linux

Download the Ubuntu Desktop ISO from `https://ubuntu.com/download/desktop`



### Notes

####  Sources

Jim's Garage 2 gpus
Craft Computing Proxmox 8.0 - PCIe Passthrough
Virtualize Windows 11 with Proxmox the Right Way!
Proxmox GPU Passthrough: The Ultimate Guide for Windows VMs! - Barmine Tech

#### automating ssh keys added to the agent

`eval "$(ssh-agent -s)"`
`ssh-add ~/.ssh/private_key`


#### SSH Connection with VSCode

If a device has native VS Code support, it's possible to use this method instead to remote into `devbuntu`:

I had to copy the SSH key from WSL `\\wsl.localhost\Ubuntu\home\wsl\.ssh` to my Windows user at `C:\Users\Justin\.ssh`, then run `ssh-add admin` from `C:\Users\Justin\.ssh` in the terminal.

Once I did this, I could add the following to my ssh `config` file:

```
Host server-name
  HostName 192.168.1.245
  User justin
  IdentityFile /mnt/c/Users/Justin/.ssh/admin
```

And finally, I can connect to the remote server over SSH in VS Code.

#### NVMe issues

`lspci -nn` to find the device id (`xx:xx.x` numneric) and vendor id (`xxxx:xxxx` in hex) at the beginning and end of the appropriate line, respectively.

`ls -l /sys/bus/pci/devices/` to find the right path for the appropriate devices (like `../../../devices/pci0000:00/0000:00:06.0/0000:02:00.0` with the device id above at the end)

`/sys/devices/pci0000\:00/` to find the right sub-directories using the path found above.

I found the following:
```
# NVMe Device @ 02:00.0
/sys/devices/pci0000:00/0000:00:06.0/0000:02:00.0

# NVMe Device @ 03:00.0
/sys/devices/pci0000:00/0000:00:1a.0/0000:03:00.0

# Confirm that they match the vendor id above, should match first four hex
cat /sys/devices/pci0000:00/0000:00:06.0/0000:02:00.0/vendor
cat /sys/devices/pci0000:00/0000:00:1a.0/0000:03:00.0/vendor

# Confirm d3cold_allowed is "1"
cat /sys/devices/pci0000:00/0000:00:06.0/0000:02:00.0/d3cold_allowed
cat /sys/devices/pci0000:00/0000:00:1a.0/0000:03:00.0/d3cold_allowed
```

Get inspired by the script at (https://bbs.archlinux.org/viewtopic.php?pid=2206758#p2206758)

```
#!/bin/bash
#  
# Adopted from nbanba
# Found at https://bbs.archlinux.org/viewtopic.php?pid=2206758#p2206758
# Problem: NVME drive goes to d3cold and never go back to d0
# Solution: Disallow d3cold power state on the drives
#

echo "------------------------------------------------------"
echo "DISABLE D3COLD ON NVME"
echo "------------------------------------------------------"
echo " "

# Set paths for nvme devices
_BUS_ROOT='/sys/devices/pci0000:00/'
_NVME0_PORT='0000:00:06.0/0000:02:00.0'
_NVME1_PORT='0000:00:1a.0/0000:03:00.0'

echo "DISABLING D3COLD ON NVME:"

# First nvme
echo 0 >"$_BUS_ROOT/$_NVME0_PORT/d3cold_allowed"
echo "$_BUS_ROOT/$_NVME0_PORT/d3cold_allowed:"
cat $_BUS_ROOT/$_NVME0_PORT/d3cold_allowed

# Second nvme
echo 0 >"$_BUS_ROOT/$_NVME1_PORT/d3cold_allowed"
echo "$_BUS_ROOT/$_NVME1_PORT/d3cold_allowed:"
cat $_BUS_ROOT/$_NVME1_PORT/d3cold_allowed

echo -e "\n---------------------------------------------"
echo "SUCESSFULLY DISABLED D3COLD ON NVME U2"
echo "---------------------------------------------"
```

Save the script to `/etc/nvme_disable_d3cold.sh`

`chmod +x /etc/nvme_disable_d3cold.sh`

Test with: `/etc/nvme_disable_d3cold.sh`

Create a cron to run the script:

```
# crontab -e
@reboot (sleep 15; /etc/nvme_disable_d3cold.sh | logger -p daemon.info -t NVME_PM)
```

`systemctl restart cron`

`systemctl status cron`


#### NVMe Pools

NVMe Pool:
1. Mirror
1. Compression `lz4`

#### Connecting an NFS Share

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

#### Connecting an SMB Share


