---
title: 'Cloud Backup with Rclone'
featured: 'no'
published: 'no'
updated: ''
repo: ''
category: 'documentation'
tags: 'docker, linux, homelab, data management'
excerpt: 'Using rlone, I can sync my local directories to the cloud to create an off-site backup. Deployed via a Docker container, cronjobs are used to schedule backups throughout the week.'
excerpt2: ''
thumbnail: 'rclone-splash.jpg'
thumbnail-alt: 'Using rclone to backup TrueNAS shares to OneDrive'
---

### Table of Contents

### ☁️ Requirements for Cloud Backup

After I built my new [home production server](https://justinmountain.com/projects/home-production-stegosaurnas), I needed to find a way to backup to the Cloud. I wanted to use OneDrive since my family is already paying for M365 access, which comes with 6x 1TB OneDrive allotments, but TrueNAS doesn't include OneDrive as one of the included Cloud Sync Providers.

> There are a number of different endpoints for backup under the **Data Protection** tab > **Cloud Sync Providers** but, as of 2025-02-17, OneDrive isn't one of them.

What I needed was something that could mount my local NFS/SMB shares as well as remote OneDrive endpoints and configure sync tasks between them. With these limitations in place, I decided that `rclone` would be the best option. It has extensive documentation and it can be deployed in a Docker container. 

### ✍🏼 Creating the Configuration File

Running `rclone` as a Docker container rather than on bare-metal takes a few extra steps to configre. Notably, in order to connect to the OneDrive remote API, I needed to run `rclone config` before deploying the container; this meant running the binary on my Windows computer first. This could've been completeed in Linux or MacOS as well, but since I'm still using Windows on my main computer, Windows was the path of least resistance. 

I simply [downloaded](https://rclone.org/install/) the approriate binary, extracted the contents, and followed the instructions for [OneDrive](https://rclone.org/onedrive/) found in their documentation.

After establishing the first connection, I created a directory to store an encryted backup (`rclone-crypt-name`) in the root of the OneDrive share that I connected to. Back in the `rclone` CLI tool, I created a new remote and gave it the name `crypt-remote`. When asked which Storage Option to use, I chose `Encrypt/Decrypt a remote`. I chose the default options to encrypt filenames and directories, and then had it generate a pass phrase and salt, both at 512 bit. 

I repeated this process for each of the different remote mount points I wanted to use. M365 comes with 6x 1TB OneDrive allotments, which means that I had to have a bit of a think about how I wanted to distribute my backups within OneDrive. Luckily, the categories of things that I want to backup remotely in this way are all under 500GB, so I made remote connections to different accounts in my M365 Family for *photos*, *backups*, and *documents*. This left me with 6 connections in total: 3 remote connections and 3 encryted connections, one for each remote.

Once the configuration had been completed, I quit the CLI tool, found the `rclone.conf` file at `C:\Users\Justin\AppData\Roaming\rclone`, copied it into the `/data` directory in my `rclone` docker project, and **added `rclone.conf` to the `.gitignore` of my homelab project**. Now I can use my Ansible playbook to deploy the container with all of the appropriate configurations to a server of my choosing. 

### 🚢 Deploying the Container

With the configuration file completed, it was time to deploy the container and make sure that I could establish connection (and sync!) between the two mounted shares. In my `compose.yml` file, I made volume mounts for each of the nfs locations that I wanted to backup, mounted them to the container in read-only mode, and spun up the container. 

When the container was running, I was able to exec into it with `docker exec -it rclone /bin/sh` and test the connectivity between the different shares. Once inside, I tested to make sure that files and directories were being moved and synced as expected with the following commands: 

1) `rclone sync /config/rclone remote:/ -v --create-empty-src-dirs` 
1) `rclone sync /config/rclone remote:/backups -v --create-empty-src-dirs`

Between these two commands, I was able to confirm that my nfs-mounted directories would sync to my OneDrive remote connections, and that I could point the sync jobs to pre-determined sub-directories within the share.

From the two commands above, I created the following command to use as the foundation for my sync tasks: `rclone sync /data/source crypt-remote:/ -v --create-empty-src-dirs --metadata --checksum`, with the source and remote destination defined accordingly.

### 🏗️ Building the Container

Now that I knew I could sync between the nfs and remote connections, it was time to setup the automations. 

To this end, I created the following files: `backup-*.sh`, `cronjobs`, and `init.sh`. 

`backup-*.sh` is a simple shell script that contains an `rclone` command, one script for each mounted directory I want to back up:

```
#!/bin/sh

echo "Sync starting at $(date '+%Y-%m-%d %H:%M:%S')..."

# Backup Directory
rclone sync /data/dir crypt-remote:/ -v --create-empty-src-dirs --metadata --checksum

echo "Sync completed successfully at $(date '+%Y-%m-%d %H:%M:%S')"
```

`cronjobs` defines the schedules to run the above scripts:

```
# Sync Backups every morning @ 3:30 AM 
30 3 * * * /sync-backups.sh

# Sync Documents every morning @ 2:00 AM 
0 2 * * * /sync-documents.sh

# Sync Archive Photos Sunday morning @ 3:00 AM 
0 3 * * 0 /sync-photo-archive.sh

# Sync Family Photos Monday morning @ 3:00 AM
0 3 * * 1 /sync-photo-family.sh
```

`init.sh` is what I want to occur when the container starts: some simple logging and the cron daemon started:

```
#!/bin/sh

echo "Rclone container initialized."

/sync-backups.sh

/sync-documents.sh

/sync-photo-family.sh

/sync-photo-archive.sh

echo "Starting cron daemon..."

crond -f -d 8
```

With the necessary files created, I needed to tailor the Docker container to my use case via `Dockerfile`:

```
ARG RCLONE_VERSION

FROM rclone/rclone:${RCLONE_VERSION}

COPY --chmod=755 sync-*.sh /

COPY --chmod=755 init.sh /

COPY cronjobs /etc/crontabs/root

ENTRYPOINT /bin/sh /init.sh
```

Finally, I just needed to adjust the `compose.yml` file to build the container from the `Dockerfile` instead of trying to pull from remote:

```
services:
  rclone:
    # image: rclone/rclone:${RCLONE_VERSION}
    build:
      context: ./data
      args:
        - RCLONE_VERSION=${RCLONE_VERSION}
  ...
```

The `args` here simply pass the `RCLONE_VERSION` variable from my `.env` file down to the `Dockerfile`. Now, when I deploy the container, it will start up the cron service and my various `rclone` scripts will run on their pre-defined schedules, encrypt my files and directories, and sync them to OneDrive.

### 🤹🏻 Managing the Container

When making changes to the underlying files, sometimes the Docker caching layers catch changes and will rebuild the container. Unfortunately, I don't completely understand this process, and I use `sudo docker compose up -d --build` to rebuild the container to ensure that my changes progate down into the container. 

When the container spins up, the `init.sh` script will run and then start the cron daemon. The different cron jobs should now run at their declared times to keep my family's files encrypted and backed up to OneDrive.
