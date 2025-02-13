---
title: 'Virtualizing Proxmox Backup Server'
featured: 'no'
published: '2025-02-06'
updated: ''
repo: ''
category: 'documentation'
tags: 'homelab, data management, proxmox, truenas'
excerpt: 'Proxmox Backup Server helps me create backups for virual machines and lxc containers in Proxmox and leverages deduplication to keep my backups stored efficiently.'
excerpt2: ''
thumbnail: 'pbs-splash.jpg'
thumbalt: 'Proxmox Backup Center logo and title'
---

### Table of Contents

### 💽 Install Proxmox Backup Center

After downloading [Proxmox Backup Server](https://www.proxmox.com/en/downloads) (PBS), I uploaded the ISO to Proxmoxand created a Virtual Machine with the following deviations from default:

```
Disks:
Disk size (GiB): 32

CPU:
2 Cores
Type host

Memory:
4096 MiB 
```

PBS is designed to be a bare-metal solution and doesn't support a Datastore being saved to a network location by default. With some careful management, it's possible to use an SMB share on a virtualized TrueNAS instance as our network storage for the virtualized PBS instance (on the same hardware).

> This is a homelab solution; a certain level of jank and *held-together-by-glue* ethos should be expeceted.

### 📦 Setup a TrueNAS Share

In the TrueNAS UI, Under the **Datasets** tab, click on **Add Dataset**. Here, I called mine `pbs` and I put it as a child of the `backups` dataset. 

While still in the Datasets tab of TrueNAS, I made sure to adjust the **Dataset Space Management** to 500GiB so that backup space would be limited. I'm not sure if this will be enough space for my modest systems, so I will need to take a look at this again after I've started rolling through automatic backups. 

In an effort to maintain some kind of best-practice, I created a user specifically for PBS by going to the **Credentials** then **Users** tab and adding a new user called `pbs`. I also gave the user a home directory in the `backups/pbs` dataset.

On the **Shares** tab, I created a new SMB Share by choosing the path to the Dataset created above (`/mnt/DataStore/backups/pbs`) and giving it a name; I chose `pbs-backups`.

If prompted, edit the ACLs. If not, click the shield next to the shield that says `Edit Filesystem ACL`. Add a mask with `Read`, `Write`, and `Execute` permissions and a User for the `pbs` user (created above) with the same permissions by selecting **+ Add Item**. Check the **Apply permissions recusively** options and click **Save Access Control List**.

The SMB share will now be available at `//192.168.1.211/pbs-backups` using the credentials created above (`pbs/password`).

### 🔙 Add the Share to PBS

With the share location determined, we need to setup the SMB share in a specific way so that the PBS user `backup` is the owner of the directory it is using to backup file to.

First, I ran `apt install cifs-utils` to ensure that the package is installed. I then made a directory for the mount (`mkdir /mnt/truenas`) and made a file to store the SMB credentials for the user above `nano /etc/samba/.smbcreds`:

```
# SMB Credentials for TrueNAS User
username=pbs
password=password
```

I reduced the permissions on the credentials file (`chmod 400 /etc/samba/.smbcreds`) and finally I could manually mount the drive to test to make sure everything was working as intended:

```
# Mount the drive
mount -t cifs -o rw,vers=3.0,credentials=/etc/samba/.smbcreds,uid=34,gid=34 //192.168.1.211/pbs-backups /mnt/truenas

# uid=34,gid=34 ensure that the backup user in PBS can access the share
```

After mounting the drive, if there is no output then it was successful. Confirm the mount with `touch /mnt/truenas/test.txt`, `ls -la /mnt/truenas/test.txt` to confirm its owned by the backup user, and `rm /mnt/truenas/test.txt` to ensure the directory is empty.

With the mount confirmed working, I added the share to fstab to ensure that it becomes available after the system reboots:

```
echo "//192.168.1.211/pbs-backups /mnt/truenas cifs vers=3.0,credentials=/etc/samba/.smbcreds,uid=34,gid=34,defaults 0 0" >> /etc/fstab
```

The last preparation I did was to create a directory for the PBS datastore with `mkdir /mnt/truenas/pbs-backups`. It should look like this:

```
root@pbs:~# ls -l /mnt/truenas/
total 0
drwxr-xr-x 2 backup backup 0 Feb  4 17:35 pbs # Home directory for our TrueNAS user
drwxr-xr-x 2 backup backup 0 Feb  6 00:10 pbs-backups # Where PBS will store backups
```

### 🏪 Create a Datastore in PBS

In the PBS UI, Under the **Datastore** tab, click on **Add Datastore**. Here, give it a name (`truenas-pbs`) and point it to the directory made after mounting the share (`/mnt/truenas/pbs-backups`).

For my *Prune Options*, I chose the following: 

```
Keep Last: 4
Keep Weekly: 2
Keep Monthly: 3
Keep Yearly: 1 
```

This will be something I continue to monitor as I continue to use the tool. 

### 🫱🏻‍🫲🏼 Connect Proxmox to PBS

Before telling Proxmox to use the new PBS server, I needed to make and give permissions to a user so that I wasn't giving out root access. 

In PBS, open the **Configuration** tab and choose **Access Control**. It should open to the **User Management** page, choose *Add**, and give it a name (I chose `backups`). 

Then go to the **Permissions** tab, then **Add** > **User Permission**. I gave my user root (`/`) permissions and the role of `DatastoreAdmin`.

Now in the Proxmox UI, go to **Datacenter** > **Storage** and add a new Proxmox Backup Storage device. 

```
id: truenas-pbs
server: ip.address
username: backups@pbs
password: password
Datastore: truenas-pbs # Name of the Datastore in PBS
```

For the Fingerprint, go back to the PBS UI and choose the **Certificates** tab. Click on the `proxy.pem` entry and click **View Certificate**. The fingerprint is at the top of the certifcate popup.

At the Datacenter level back in the Proxmox UI, I went to the **Backup** tab to schedule backup jobs. Be careful to choose the `pbs` storage option and select the desired schedule. 

I created separate backup jobs for each VM that I wanted to backup.

> *DO NOT* use PBS to to backup its own virtual machine! 

I ignored the **Retention** tab when creating the backup jobs. I find it more intuitive to use PBS to manage the backups with Proxmox using PBS as its backup location. 

I also created a verify job by going to the backup Datastore in PBS, going to the **Verify Jobs** tab and adding a new job. I used the default settings, daily verifications and re-verifying after 30 days.

At this point, we can create individual backups for the VMs from inside Proxmox. In the Proxmox UI, we can click on the VM/LXC we want to backup, and choose the **Backup** tab to backup individual items. I did this to both confirm that the backup workflow was working as intended, and to create a first backup for the job created above to take over at 3am.

### Sources

1. https://pbs.proxmox.com/docs/
1. https://www.youtube.com/watch?v=gbVFTl8bnt8
1. https://www.youtube.com/watch?v=84QZc5cnKZc&t=1226s
1. https://www.youtube.com/watch?v=KxPl8SHREcE
1. https://www.youtube.com/watch?v=qms3ffm8H_4
