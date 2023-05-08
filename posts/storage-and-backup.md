---
title: 'Storage and Backup'
published: '2023-04-15'
updated: '2023-04-15'
repo: ''
category: 'documentation'
tags: 'linux, homelab, data management'
excerpt: 'Ensuring a proper backup strategy is an important part of a digital life.'
thumbnail: ''
thumbnail-alt: ''
---

## Storage and Backup

### Table of Contents

### Mounting Network Drives

#### Change this to network mounting via docker-compose?

fstab to mount network drives? (techhut youtube video)


Files are stored on my NAS. In order to enable client to client file sharing, I installed cifs-utils. I can't recall if this was a necessary step, but it's in my notes and I will check next time I setup a system.

sudo apt update
sudo apt upgrade
sudo apt-get install cifs-utils

Now any time I need mount a new folder, I use

sudo mount -t nfs 192.168.1.101:/share/Destination_Folder ~/path/to/source

I also need to ensure that nfs share is enabled on the NAS

directories to be mounted on boot:

Deluge:
- sudo mount -t nfs 192.168.1.101:/share/Download ~/deluge/downloads/completed

Jellyfin
- sudo mount -t nfs 192.168.1.101:/share/Multimedia/TV ~/jellyfin/media/TV
- sudo mount -t nfs 192.168.1.101:/share/Multimedia/Movies ~/jellyfin/media/Movies

I think something happens when the server is reset....
  After reboot:
    Remount network shares
    Restart containers
    Rescan library (Jellyfin)


https://www.reddit.com/r/selfhosted/comments/11vp9cr/stupid_docker_tricks_dont_start_docker_container/

https://www.reddit.com/r/jellyfin/comments/rmyowf/network_share_access/

When adding a folder that needs to be shared via nfs, Control Panel > Privilege > Shared Folders > Action > Edit Shared Folder Permission > Select permission type > NFS host access  > Allow Access right > 
Host / IP / Network: 192.168.1.100
Permission: read/ write
Squash Option: NO_ROOT_SQUASH


https://www.reddit.com/r/jellyfin/comments/qa4mlt/example_of_creating_a_systemd_file_for_the/

https://www.reddit.com/r/jellyfin/comments/rmyowf/network_share_access/

### Workflow

##### Photos

1. Phones are backed up to folder on Veloserver (SSD) via Syncthing/PhotoSync

```
/photo-uploads/
```
 - Folder is backed up to NAS routinely

2. This folder contains photos from both phones, and is accessed for management via Nextcloud
3. Photos are culled via Nextcloud before being copied over to NAS
 - Great photos should also be copied to Google Photos for picture frames and sharing

```
/Photos/year/...
```

3. Photos archived to NAS are accessible via Nextcloud/other photo app or OneDrive

##### Documents

1. Computers have folder synced to /Storage'
2. /Storage is backed up to local drive and cloud

#### Nextcloud

4. Finalize sync from phones to NAS

#### Syncthing

1. Work machines to /Storage space
  1. Justin's Desktop
  2. Tamy's Laptop
  3. Veloserver
    1. Containers
    2. Repos
2. /Storage to MyPassport
3. /Storage to OneDrive
  1. Because of 1tb limits, should I separate this into two categories (justin and tamy)?
  2. Should this get encrypted?

https://www.youtube.com/watch?v=PSx-BkMOPF4

#### Devices to maintain backups for

1. Tamy's Phone (nextcloud for photos)
2. Justin's Phone (nextcloud for photos)
3. Tamy's Computer (syncthing for documents folder)
4. Justin's Computer (syncthing for documents folder)
5. Veloserver (syncthing for docker files, VM for backup in future)
6. NAS (to portable HDD and Cloud)

#### Future

1. Better understanding of what's required for updates and maintenence (watchtower?)
    https://confluence.atlassian.com/kb/optimize-and-improve-postgresql-performance-with-vacuum-analyze-and-reindex-885239781.html
    docker exec -it nextcloud updater.phar to execute update, read: 
      https://hub.docker.com/r/linuxserver/nextcloud#application-setup
2. opening it up to remote access (wireguard?)

nginx.conf here was needed for a previous incarnation, saving for reference
https://github.com/nextcloud/docker/blob/master/.examples/docker-compose/insecure/mariadb/fpm/web/nginx.conf


#### Future Projects

docker maintenence/updates

https://github.com/AdrienPoupa/docker-compose-nas

### Setting up the Environment

#### Getting redis working

1. Run docker-compose
2. Setup server (give 1-2 minutes), install DB: user: nc ps bcpw, name: nc, host: database.docker.ip:5432 (pg) port 3306 (mariadb)
  Database user: nextcloud
  Database password: nextcloudpassword
  Database name: nextcloud
  Database host: 172.17.0.2:5432 (found in portainer)

3. when setup complete, create admin account, log out, docker-compose down
4. nano nextcloud-config/www/nextcloud/config/config.php
5. add redis config
  'memcache.local' => '\\OC\\Memcache\\Redis', # this line from ...\\APCu
  'memcache.locking' => '\\OC\\Memcache\\Redis',
  'redis' => 
  array (
    'host' => '172.17.0.3',
    'port' => 6379,
    'timeout' => 0.0,
    'password' => '', // Optional, if not defined no password will be used.
  ),
6. docker-compose up -d 
7. docker exec -ti redis sh -c 'redis-cli MONITOR'
8. Login, navigate around, if activity is shown it works!
9. ctrl + c to exit redis monitor


#### Setting Up Nextcloud

##### External Storage

Setting > Apps 

Search 'External Storage' click 'Download and enable'

Settings > Administrative settings > External Storage

FTP storage type which points to a folder on NAS (192.168.1.101 && /Photos/unsorted-uploads), without secure ftps and a 'nextcloud' user setup on the nas

##### Preview Generator

###### Generate previews

https://github.com/nextcloud/previewgenerator



docker exec -it nextcloud bash

```
# cd /config/www/nextcloud
config:app:set --value="256"  previewgenerator squareSizes
config:app:set --value="256" previewgenerator widthSizes
config:app:set --value="256" previewgenerator widthSizes
```

  This will only generate:

  square previews of: 64x64, 256x256 and 1024x1024
  aspect ratio previews with a width of: 64, 256 and 1024
  aspect ratio previews with a height of: 64, 256 and 1024
  Note:

  preview sizes are always a power of 4.
  The smallest size is 64
  The max size is determined by your preview settings in config.php


I want to skip a folder and everything in/under it
Add an empty file with the name .nomedia in the folder you wish to skip. All files and subfolders of the folder containing .nomedia will also be skipped.


1. nano nextcloud-config/www/nextcloud/config/config.php

Add this to the bottom of the config file (same one used to enable Redis caching)

```
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
  ),

# A second list
'enable_previews' => true,
  'enabledPreviewProviders' =>
  array (
    0 => 'OC\\Preview\\TXT',
    1 => 'OC\\Preview\\MarkDown',
    2 => 'OC\\Preview\\OpenDocument',
    3 => 'OC\\Preview\\PDF',
    4 => 'OC\\Preview\\MSOffice2003',
    5 => 'OC\\Preview\\MSOfficeDoc',
    6 => 'OC\\Preview\\Image',
    7 => 'OC\\Preview\\Photoshop',
    8 => 'OC\\Preview\\TIFF',
    9 => 'OC\\Preview\\SVG',
   10 => 'OC\\Preview\\Font',
   11 => 'OC\\Preview\\MP3',
   12 => 'OC\\Preview\\Movie',
   13 => 'OC\\Preview\\MKV',
   14 => 'OC\\Preview\\MP4',
   15 => 'OC\\Preview\\AVI',
 )
```

# See also : https://github.com/pulsejet/memories/wiki/File-Type-Support

```
docker exec --user 1000 -it nextcloud /config/www/nextcloud/occ preview:generate-all
```

# Being able to generate video previews
https://github.com/nextcloud/previewgenerator/issues/233#issuecomment-1057217769

docker exec -it --user root nextcloud /bin/bash -c 'apt-get update && apt-get install -y ffmpeg'



###### Cronjob for preview generation




### BrontosaurNAS tree ideas

1. Cleanup NAS Structure

BrontosaurNAS/
    ├── Download/
    └── Multimedia/
        ├── tv/
        └── movies/
        ├── music/
        └── books/
    └── Photos/
        ├── unsorted-uploads/
    │       ├── year/
        ├── archive/
        ├── year/
    │       ├── month-event/
    │       ├── uncategorized/
    └── Storage/
        └── documents/
    │       ├── family/
    │       ├── justin/
    │       ├── sebastian/
    │       ├── tamy/
        └── backups/
            ├── veloserver/

### To do

note to self: ensure all containers are taken down between spinup attempts otherwise some things can block one another

0. Move photos from /Storage/Photos... to \\192.168.1.101\Photos\
1. Sort photos to year/month
2. Backup to HDD
3. Clean recycling
4. Backup to OneDrive
 - IgarashiMountain for family photos, documents
 - Tamy for Tamy archive, documents
 - Justin for Justin archive, documents
5. Setup phone syncing
6. Setup Nextcloud access
7. Sync veloserver
8. Update Google Photos
 - Remove all photos currently there
 - Create albums for 1) Sharing 2) Home
 - Ideally these are on the igarashimountain@gmail.com account
9. Create sync folder on Tamy's laptop

1. Create backlog list to go through photos to be added to shared albums
 - 2019
  - nagano
  - alon/mai wedding
  - tokyo hanami
  - flower park
  - philippines
  - fujinomiya
  - tokyo
  - kyoto
  - brazil engagement party



