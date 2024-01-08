---
title: 'Proxmox'
featured: 'no'
published: 'no'
updated: ''
repo: ''
category: 'documentation'
tags: 'linux, homelab, data management'
excerpt: 'Ensuring a proper backup strategy is an important part of a digital life.'
thumbnail: ''
thumbalt: ''
---

### Table of Contents

### Steps to Setup a VM

1. Setup
- Turn off "Set up this disk as an LVM group"
- Setup extra drives if necessary/mounted in proxmox when prompted
  - Confirm drive mounts via `lsblk -f` and `sudo fdisk -l`
- Install OpenSSH server    
- sudo apt update && sudo apt upgrade -y

Optional Mount extra disks
- `lsblk` to confirm extra drive
- `fdisk` > `d` to delete all partitions > primary partition > partition number > first sector > last sector `w` to save
- `lsblk` to cofirm creation and size
- `mkfs -t ext4 /dev/sdb1` to format
- `mkdir /faststorage` to make a folder to mount to the new partition
- `mount /dev/sdb1 /faststorage` to mount
- `lsblk` to confirm

2. Install QEMU Agent
- sudo apt-get install qemu-guest-agent -y
- shutdown, enable qemu agent in options, reboot
- then `systemctl status qemu-guest-agent` to check its active

3. Make static IP
- `ip addr`: find the network adapter we are using
- `sudo nano /etc/netplan/0` <... tab to autocomplete into the file>
- enter into the yaml file in the directory

```
network:
  version: 2
  renderer: networkd
  ethernets:
    ens18: # network adapter
      dhcp4: no
      addresses: [192.168.1.245/24] # Static IP Don't forget to change this! 
      routes:
        - to: default
          via: 192.168.1.1 # default gateway 
      nameservers:
          addresses: [1.1.1.1,8.8.8.8] # dns resolution
```

- reboot

4. Install Docker

https://docs.docker.com/engine/install/ubuntu/

5. Install Syncthing for data backup



---

1. Setup Uptime Kuma and connect to Discord
2. Setup PiHole
3. Setup Unbound
4. Learn LXC Containers for PiHole OR the other one?


### Automation

Figure out a way to automate (ansible?) the maintenence of VMs:

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

#### Notes

I need a way to automate (containerize?) the app.

Currently it needs to install all of the above steps, as well a few dependencies before it will work.
- At the time of writign: gray-matter, tailwindcss, autoprefixer, @tailwindcss/typography, unified, remark-parse, 

I want to be able to push an update and have a new instance be generated under an ASG which then tears down the old instance.

Maybe this is done with containers, maybe it's done by spinning up an instance: requires investigation.


