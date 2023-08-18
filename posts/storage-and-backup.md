---
title: 'Storage and Backup'
featured: 'yes'
published: '2023-06-15'
updated: '2023-06-15'
repo: ''
category: 'documentation'
tags: 'linux, homelab, data management, docker'
excerpt: 'A properly organized 3-2-1 backup strategy for all of the devices in my home keeps photos safe and files accessible.'
thumbnail: 'storage-architecture.jpg'
thumbnail-alt: 'Architecture diagram for my backup strategy'
---

## Storage and Backup

[![Diagram of the structure of the backup solution](storage-architecture.jpg "Architecture Diagram")](storage-architecture.jpg)
*The best time to organize and backup data was 20 years ago, the second best time is now. - Confucius*

### Table of Contents

### 💾 Dealing with Data Debt

I had two serious data-related issues that I had been putting off for years:

1. My family's data was being stored over different drives and devices with no order. 
2. None of the devices had backups - if they crashed everything on it was gone too. 

These issues became glaring after my son was born and our family photos became irreplacable. I couldn't put them off any longer and I decided that I needed to find a proper solution to this problem. 

In order to do this properly, I needed to create a 3-2-1 backup strategy. This meant that I needed to have 3 copies of the data, over 2 mediums, with 1 stored off-site.

Luckily I had an older 2-bay NAS that I could use as a primary backup location in RAID0 and a 2TB external USB HDD that could be used as a secondary backup. The third copy of the data would be backed up to the cloud, satisfying the 3-2-1 strategy. 

### 🏗️ Architecting the Solution

With the *what* in place, it was time to tackle the *how*. I used the following requirements to search for the right architecture to put into place:

1. Select directories on each device need to be automatically backed up.
2. Phones need photos automatically offloaded and backed up.
3. Photos need to be easily accessible and viewable, with the ability to make albums and remove duplicates.

Adding the caveat of being able to replace Google Photos seemed like a reasonable stretch goal for this project since the workflow of managing the library and creating albums could theoretically taken care of by a possible solution. 

Syncthing stuck out as the obvious choice for syncing files and directories between devices, but finding a photo management and gallery solution that had the lowest possible ease-of-use-friction ended up being quite a bit more work than I had imagined it would be. I tried out a number of different open-source photo sync and gallery services, namely PhotoPrism, Nextcloud, Immich, and LibrePhotos.

I wanted whichever service I chose to use my existing folder structure, add photos to the same existing structure, and not require the service to integrate the photos - I didn't want to leave Google for another walled garden. I was okay with the service duplicating the photos to some extent (like a reduced quality preview), but I didn't want or need the service to require a complete copy to be made since I wanted it to be independent from my backup strategy. 

After a lot of trial and error, I ended up with a combination of Nextcloud (with the preview generator, and memories extensions) to handle photo backups and Syncthing to manage file and directory backup. 

[![Diagram of the structure of the backup solution](storage-architecture.jpg "Architecture Diagram")](storage-architecture.jpg)
*Proposed architecture for photo and file backup solution.*

As you can see in the diagram, Veloserver contains a Nextcloud instance which backs up photos from phones to a dedicated SSD drive. Using Syncthing, photos are then be backed up to BrontosaurNAS, which are then backed up again on- and off-site. Clients and servers use Syncthing to back up important directories, like work documents and docker volumes. 

Storing an extra/fourth copy of the photos on Veloserver's SSD is a necessary extra step for a serious increase in usability. While it's possible to only store the previews on Veloserver which link back to BrontosaurNAS, it has mechanical HDDs and doing so results in lag between wanting to view the full-size photo and it being delivered to the device. This extra storage requirement seemed like a decent and easy to swallow compromise that resulted in a significant increase in usability when wanting to view photos. 

### 🖼️ Photo Management and Gallery with Nextcloud

I opted for a custom solution using Docker rather than simply using Nextcloud AIO for a couple of reasons: I was looking for something more lightweight and I didn't want or need a lot of the features packed into AIO, and part of the fun of self-hosting is cosplaying as a system administrator. 

The only thing missing in my installation is a stable and reliable way to upgrade the services. Though, ultimately, I think this is for the best as any security concerns are negligible since I won't be exposing the service to the internet and updating the backend should be done with intention anyways, as it could very easily break the installation. 

The docker stack that I ended up going with combines a Postgres database with a Redis cache on the backend and the Preview Generator and Memories extentions on the frontend. I came to this solution after a lot of trial and error, as it seemed like the best way to deliever content quickly and efficiently while still being as stable as possible. There are certainly other viable configurations, but at some point one has to decide to pursue one and learn its faults and limitations along the way.

Moving forward with this configuration required some extra setup:

#### 🔗 Installing Nextcloud and Configuring the Redis Cache

After running the docker-compose.yaml file for the first time, Nextcloud needs a few minutes to finish some behind-the-scenes setup. Once that is completed, navitgating to the server's IP on port 443 (or whatever was setup in docker-compose.yaml) in a web browser will yield the setup interface. 

Click on PostgreSQL and input the following information:

```
Database user: $POSTGRES_USER
Database password: $POSTGRES_PASSWORD
Database name: $POSTGRES_DB
# `docker inspect <container id> | grep IPAddress` to find IP, 5432 is the default port for Postgres
Database host: 172.17.0.2:5432 # found via `docker inspect <containerid>`
```

Once the setup is complete, create an admin account for the instance, log out and tear down the containers; it's time to edit some config files to enable the Redis cache:

```
# Open the config file
nano config/www/nextcloud/config/config.php

# Replace the following line:
'memcache.local' => '\\OC\\Memcache\\APCu',

# With:
'memcache.local' => '\\OC\\Memcache\\Redis',
'memcache.locking' => '\\OC\\Memcache\\Redis',
'redis' => 
array (
  'host' => '172.17.0.3',
  'port' => 6379,
  'timeout' => 0.0,
  'password' => '', // Optional, if not defined no password will be used.
),

```

Before moving on, I like to test the cache to ensure that setup completed successfully. To do so, spin the containers back up and enter `docker exec -ti nc-redis sh -c 'redis-cli MONITOR'` in the command line, then navigate to the Web UI, log in, and click around the freshly installed Nextcloud instance. If there is activity in the redis-cli monitor, it was installed correctly, and we can exit the monitor with `ctrl + c`.

#### 🪧 Generating Previews

With Redis setup, now is the perfect time to setup and configure the preview generator. 

In the Web UI while logged in to the admin account, navigate to the Apps section, search for and install "Preview Generator" and might as well do the same for "Memories" while we're here. Now tear down the containers and navigate to the same config file we edited while setting up Redis:

```
# Navigate to the same config file used to add Redis:
nano config/www/nextcloud/config/config.php

# Add the following to the bottom of the config file, where appropriate:
'enable_previews' => true,
'enabledPreviewProviders' => 
array (
  0 => 'OC\\Preview\\PNG',
  1 => 'OC\\Preview\\JPEG',
  2 => 'OC\\Preview\\GIF',
  3 => 'OC\\Preview\\BMP',
  4 => 'OC\\Preview\\XBitmap',
  5 => 'OC\\Preview\\Movie',
  6 => 'OC\\Preview\\PDF',
  7 => 'OC\\Preview\\MP3',
  8 => 'OC\\Preview\\TXT',
  9 => 'OC\\Preview\\MarkDown',
  10 => 'OC\\Preview\\MP4',
  11 => 'OC\\Preview\\AVI',
  12 => 'OC\\Preview\\HEIC',
  13 => 'OC\\Preview\\JPG',
),
```

By default previews will be generated at all sizes, which is quite unneccesary and wastes a lot of space. We can tell Nextcloud at which sizes we would like previews generated at with a few commands:

```
# Set max preview x and y
docker exec --user 1000 -it nc-nextcloud /config/www/nextcloud/occ config:system:set preview_max_x --value 1024

docker exec --user 1000 -it nc-nextcloud /config/www/nextcloud/occ config:system:set preview_max_x --value 1024

# Provide Preview Generator with sizes to generate
docker exec --user 1000 -it nc-nextcloud /config/www/nextcloud/occ config:app:set --value="64 256 1024" previewgenerator squareSizes

docker exec --user 1000 -it nc-nextcloud /config/www/nextcloud/occ config:app:set --value="64 256 1024" previewgenerator widthSizes

docker exec --user 1000 -it nc-nextcloud /config/www/nextcloud/occ config:app:set --value="64 256 1024" previewgenerator heightSizes
```

Preview Generator works by watching incoming files and keeping track of which ones it has generated previews for. Then, once told to do so, it will start generating previews based on the parameters we configured above. However, it's not ideal to need to manually tell Nextcloud to generate our previews. Instead, we can setup a cron job to run the command at pre-determined intervals by first creating a bash script with the necessary command to send to Nextcloud:

```
#!/bin/bash

DOCKER_COMMAND="docker exec --user 1000 nc-nextcloud /config/www/nextcloud/occ preview:pre-generate"

# Set up authentication
export DOCKER_CONTENT_TRUST=0
export DOCKER_USERNAME="username"
export DOCKER_PASSWORD="password"

# Run the Docker command
$DOCKER_COMMAND
```

With the script in place:

```
# Edit the crontab file
crontab -e

# Insert at the end
*/10 * * * * path/to/generatePreviews.sh >> path/to/logs.txt 2>&1
```

This will run the generation script every 10 minutes, but it's possible to setup the script to run at any interval or pre-determined time via the cron time expression.

*Storing a password in the script like this is insecure and not recommended. I did it this way and filed it under '**Problems for Future Justin**' with the thinking that if someone has access to the server, they have the password already.*

#### 🪣 Consolidating Photos to the Nextcloud Directory

Now that the Nextcloud environment and Redis have been set up, it's time to add the photos that will be managed. When offloading photos from our phones, I like to have Nextcloud organize them into directories `year/month` and I also have it rename the files. Each phone has a different user and syncs photos into one shared directory. Its ability to organize photos like this was actually one of the deciding factors when I was choosing it our photo gallery. 

With phones backed up to Nextcloud, I needed to consolidate all of the previously "backed up" photos from different hard drives and devices scattered throughout our home. I did this by consolidating existing photos into one unified directory on BrontosaurNAS, then syncing the shared upload location with BrontosaurNAS - essentially mirroring the data to both locations. I did this via Syncthing (more on Syncthing below), but it also could have been done through network mounted drives. 

The Nextcloud interface uses the Postgres database to store file locations, the previews, and other meta data. Files added to the directory outside of the Nextcloud interface are not in the database and will therefore not appear within Nextcloud, leaving any photos added via Syncthing or manually added to the directory missing from the Nextcloud app.

Luckily, similar to using preview generation, there is a command that can be run to re-scan the directory for files that were added outside the Nextcloud interface. Just like the preview generation command, I find this command works best via a cron job, and so it was set up in a similar fashion via a bash script:

```
#!/bin/bash

DOCKER_COMMAND="docker exec --user 1000 nc-nextcloud /config/www/nextcloud/occ files:scan --all"

# Set up authentication
export DOCKER_CONTENT_TRUST=0
export DOCKER_USERNAME="username"
export DOCKER_PASSWORD="password"

# Run the Docker command
$DOCKER_COMMAND
```

With the script in place: 

```
# Edit the crontab file
crontab -e

# Insert
*/10 * * * * path/to/scanAllFiles.sh >> path/to/logs.txt 2>&1
```

Like above, the script will run every 10 minnutes and *it's still not a good idea to store the password this way*.

For both the preview generation and file scan cron jobs, its possible to run the command from the terminal manually to enrure that they're working as intended - and it's probably a good idea. 

### 🖧 Centralized Backups via Syncthing

As mentioned above, Syncthing can be used to consolidate and sync directories across devices. I am using it to sync the photos on the Nextcloud VM to my NAS and vice versa as well as backup certain directories on other client devices in our home. 

In this way, for photos, I am able to consolidate all of the various photo folders into one folder on my NAS and have all of those photos pushed to Nextcloud, while simultaneously having Nextcloud push all its newly acquired photos to the NAS. And for files, I'm able to tell each device exactly what needs to be backed up to the NAS.

Once installed, syncing files is as easy as choosing a folder, a device to share with, send/receive constraints, and versioning. The receiving device will get a notification of the share and once the location and settings are in place, the two devices will sync their files.

SyncTrazor was used to install it on Windows clients, and BrontosaurNAS is a QNAP 2-bay NAS, so Synthing was installed via the App Center through its admin interface. 

Syncthing is meant to be accessed and managed via the device it is setup on. Since I have Nextcloud installed on a VM running headless Ubuntu, I need to be able to access its instance of Syncthing over the network, so there are a few extra steps to follow:

#### 💽 How to Run Syncthing on Headless Ubuntu Server 22.04

First, to install Syncthing, I simply followed the instructions found on the its [official website](https://apt.syncthing.net/), checking that it was installed correctly with `syncthing --version`. 

In order to add headless functionality to Syncthing, we need to make a new systemd service for it:

```
# Create a system service file for Syncthing
sudo nano /etc/systemd/system/syncthing@.service

# Paste the contents of the service file
[Unit]
Description=Syncthing - Open Source Continuous File Synchronization for %I
Documentation=man:syncthing(1)
After=network.target

[Service]
User=%i
ExecStart=/usr/bin/syncthing -no-browser -gui-address="0.0.0.0:8384" -no-restart -logflags=0
Restart=on-failure
SuccessExitStatus=3 4
RestartForceExitStatus=3 4

[Install]
WantedBy=multi-user.target
```

*Service file copied from [Computing for Geeks](https://computingforgeeks.com/how-to-install-and-use-syncthing-on-ubuntu/).*

After saving the service file:

```
# Reload systemd
sudo systemctl daemon-reload

# Start the syncthing service
sudo systemctl start syncthing@$USER

# Enable the syncthing service
sudo systemctl enable syncthing@$USER

# Verify the syncthing service status is active
systemctl status syncthing@$USER
```

With all of the above done, it should now be possible to access Syncthing over the network using the server's IP address and port 8384. 

### 🪄 Automating Search and Deletion of Duplicate Photos

With all of our photos synced to one directory via Nextcloud and backed up to the NAS, it was finally time to tackle duplicate files. Since the backup strategy I had been using was patchwork at best, there were multiple copies of many photos from different backup attempts, often with different naming conventions. 

Possibly the only redeeming quality of my previous attempts at backup was that they were more or less organized by date taken. While there had previously been folders in random locations containing these backups, after a concerted effort towards organizing all of my family's files and photos, all our photos were structured into one date-based file tree. The downside was that there were over 41,000 photos to go through if I wanted to clean up remove duplicate photos. 

I wrote a [few scripts](https://github.com/JustinMountain/docker-compose/tree/main/Nextcloud/scripts) to help me parse the photos one month at a time. These scripts would first look for duplicate files based on exact file size, then output to the console when it found two files of identical size. I used this information to scan the folder to see if the files were indeed duiplicates, then ran a second script which uses filename patterns to remove the duplicate files. I would then then run the script to find duplicates again and clean up the few that were overlooked by the removal script. I felt that this was a nice compromise between looking at 41,000+ photos individually and completely allowing a script to clean up duplicate files. 

### 🥕 More Work?

When I have time to revisit this project, figuring out updates is at the top of the list. I know that Watchtower can be deployed as a container to watch for updates to other container images, but instead of jumping into this to get it done quickly I feel that really wrapping my head around automating updates is a project all on its own. 

Another thing I'd like to figure out is opening up Nextcloud to remote access so that photos can be backed up while we're not at our home. It seems like Wireguard or Tailscale are the best options for this at the moment, but like automating updates, I think remote access is also a topic that deserves its own dedicated project. 

I would also like a way to automate pushing certain photos (ideally ones in specified albums) to Google Photos so they can be more easily shared with extended family while also not requiring giving them access to the Nextcloud server remotely. 

I've also heard great things about Immich as a Google Photos replacement, but I didn't set it up as my main backup solution because 1) they say explicitly not to rely on it on their site and 2) when I made the decision to use Nextcloud, Immmich was incompatible with pre-existing file structures. I hear that the second point is in early testing and they are getting ever closer to a full release, so maybe I should check it out again. 

There's also this strange issue where the containers need to be manually torn down and spun back up when the VM restarts. I looked into the docker restart policy and tried setting up custom systemd services to address the issue, but I couldn't find a solution. This shouldn't be an issue, nor is it difficult to manage as long as I remember to restart the service when the VM/host restarts.
