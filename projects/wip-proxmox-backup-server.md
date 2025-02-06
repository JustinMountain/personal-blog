---
title: 'Virtualizing Proxmox Backup Server'
featured: 'no'
published: '2025-02-06'
updated: ''
repo: ''
category: 'documentation'
tags: 'homelab, data management, proxmox, truenas'
excerpt: 'Proxmox Backup Server helps us create backups for virual machines and lxc containers in Proxmox and leverages deduplication to keep our backups stored efficiently.'
excerpt2: ''
thumbnail: ''
thumbalt: ''
---

### Table of Contents

### Intro

1. `thumbnail` size is `1234x1234`
1. Emojis in titles
1. Edit pass

### Install Proxmox Backup Center

32GB, 2 cores, 4096MB RAM

### Setup a TrueNAS share

Credentials > Users > add user:

```
# SMB Credentials created for TrueNAS User
username=pbs
password=password
```

Don't forget to give the User a home directory.


Setup a new Dataset, I called mine `pbs` and I put it as a child of the `backups` dataset.

In the PBS UI, Under the **Datasets** tab, click on **Add Dataset**. Here, I called mine `pbs` and I put it as a child of the `backups` dataset. 

> In the Datasets tab of TrueNAS, I made sure to adjust the **Dataset Space Management** to 500GiB so that backup space would be limited.

Now, on the **Shares** tab, create a new SMB Share by choosing the path to the Dataset created above (`/mnt/DataStore/backups/pbs`) and giving it a name; I chose `pbs-backups`.

If prompted, edit the ACLs. If not, click the shield next to the shield that says `Edit Filesystem ACL`. Add a mask with `Read`, `Write`, and `Execute` permissions and a User for the `pbs` user (created above) with the same permissions by selecting **+ Add Item**. Check the **Apply permissions recusively** options and click **Save Access Control List**.

The SMB share will now be available at `//192.168.1.211/pbs-backups` using the credentials created above (`pbs/password`).

### Add the share to PBS

`apt install cifs-utils`

`mkdir /mnt/truenas`

`nano /etc/samba/.smbcreds`

```
# SMB Credentials created for TrueNAS User
username=pbs
password=password
```

`chmod 400 /etc/samba/.smbcreds`

`mount -t cifs -o rw,vers=3.0,credentials=/etc/samba/.smbcreds,uid=34,gid=34 //192.168.1.211/pbs-backups /mnt/truenas`

After mounting the drive, if there is no output then it was successful. Confirm the mount with `touch /mnt/truenas/test.txt`, `ls -la /mnt/truenas/test.txt` to confirm its owned by the backup user, and `rm /mnt/truenas/test.txt` to ensure the directory is empty.


Now we add the share to fstab to ensure that it becomes available after the system reboots:

```
echo "//192.168.1.211/pbs-backups /mnt/truenas cifs vers=3.0,credentials=/etc/samba/.smbcreds,uid=34,gid=34,defaults 0 0" >> /etc/fstab
```

The `uid=34,gid=34` addition makes sure that the `backup` user can execute on the share. 

The last preparation we have to make is to create a directory for the pbs datastore with `mkdir /mnt/truenas/pbs-backups`.

### Create a DataStore in PBS

In the PBS UI, Under the **Datastore** tab, click on **Add Datastore**. Here, give it a name (`truenas-pbs`) and point it to the directory made after mounting the share (`/mnt/truenas/pbs-backups`).

> Prune Options: I chose 1 daily, 1 weekly, 1 monthly... I need to investigate this step after completing setup testing

### Connect Proxmox to PBS

Before connecting, we need to make and give permissions to a user so that we aren't giving out root access. 

In PBS, open the **Configuration** tab and choose **Access Control**. It should open to the **User Management** page, choose *Add**, and give it a name (I chose `backups`). 

Then go to the **Permissions** tab, then **Add** > **User Permission**. I gave my user root (`/`) permissions and the role of `DatastoreAdmin`.

In Proxmox, go to **Datacenter** > **Storage** and add a new Proxmox Backup Storage device. 

```
id: truenas-pbs
server: ip
username: backups@pbs
password: password
Datastore: truenas-pbs # Name of the Datastore in pbs
```

For the Fingerprint, go to pbs and choose the **Certificates** tab. Click on the `proxy.pem` entry and click **View Certificate**. The fingerprint is at the top of the certifcate popup.

At the Datacenter level, we can go to the **Backup** tab to schedule backup jobs. Be careful to choose the `pbs` storage option and select the desired schedule. 

> *DO NOT* use pbs to to backup its own virtual machine! 

The **Retention** tab when creating a backup job can be used to determine how many, and which, backups to keep.

With a daily backup at 3am, I chose the following for my prune settings:

```
Keep Last: 4
Keep Weekly: 2
Keep Monthly: 3
Keep Yearly: 1 
```

I also created a verify job by going to the backup Datastore in pbs, going to the **Verify Jobs** tab and adding a new job. I used the default settings, daily verifications and re-verifying after 30 days.

At this point, we can create individual backups for the VMs from inside Proxmox. In the Proxmox UI, we can click on the VM/LXC we want to backup, and choose the **Backup** tab to backup individual items. I did this to both confirm that the backup workflow was working as intended, and to create a first backup for the job created above to take over at 3am.

### Sources

https://www.youtube.com/watch?v=gbVFTl8bnt8
https://www.youtube.com/watch?v=84QZc5cnKZc&t=1226s
https://www.youtube.com/watch?v=KxPl8SHREcE
https://www.youtube.com/watch?v=qms3ffm8H_4
