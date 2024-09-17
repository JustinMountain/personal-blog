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
