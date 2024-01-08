---
title: "You Wouldn't Download a Media Server?!"
featured: 'no'
published: 'no'
updated: ''
repo: ''
category: 'documentation'
tags: 'linux, homelab, docker, media'
excerpt: 'Occupying the grey zone.'
thumbnail: ''
thumbalt: ''
---

### Table of Contents

### Who's Steering the Ship?

After I self-hosted Nextcloud to [store my family's photos](/projects/storage-and-backup), I decided that I wanted to centralize media streaming in our home as well. For us, this is about subtitles. We live in a bilingual house: English and Brazilian Portuguese. Brazilian Portuguese is rarely found on the streaming platforms and none of the DVDs that I own come with them. 

I am in no way advocating for piracy. If we want to watch a movie that we own, there is no easy and reliable way to do so in the way that is best for our family. Open source to the rescue! 

The media server that I have setup here is the Servarr or *arr stack. Everything is open-source and it allows our family to watch our movies in the way that works best for us. 

**Picture of Lord of the Rings DVDs**

The server that I'm using to host this media stack has a DVD drive, so a future project is going to be taking further inspiration from [Jeff Geerling](https://www.youtube.com/watch?v=RZ8ijmy3qPo) to create a complete pipeline for backing up our DVDs. For now, we are relying on the community's help.

This media server downloads media files and stores them in a centralized location. It generates meta-data for the media and downloads subtitles that suit the file. It then uses the Jellyfin app to broadcast and share the media locally on our home network. This enables our family to watch our media the way that works best for us. Again, I am in no way advocating for piracy [of any kind](/projects/blocking-ads-on-my-home-network).

The docker-compose file I used for this setup can be found on my [GitHub page](https://github.com/JustinMountain/docker-compose).

### Network Mounting via fstab

I've used a virtual machine to host this servarr stack and I will be using the NFS feature on BrontosaurNAS to hold the files. This means that I need to create a network share on the virtual machine. This will allow me to offload bulk storage of infrequently accessed files to the slower and larger disks. 

Setting up the NFS share is relatively simple:

```
# Install nfs packages
sudo apt-get install nfs-common

# Create local folder to mount to NAS
sudo mkdir /media/brontosaurnas

# Create directory on NAS to share with server and enable NFS access to it
# 192.168.1.101:/share/Multimedia

# Open fstab
sudo nano /etc/fstab

# Add Mount to the bottom
192.168.1.101:/share/Multimedia /media/brontosaurnas nfs defaults 0 0

# Test connection
sudo mount -a
```

Once these steps have been completed, files can be copied from the virtual machine to BrontosaurNAS via NFS by simply copying or moving the files into the linked directory. 

#### Downloading ISOs

After downloading an ISO via Deluge, it will need to be manually moved from the virtual machine to somewhere else on the network. There are ways to automate this as well, but it's not something that comes up often enough to dedicate the time to setting it up at the moment.

```
# Make a folder on the target drive
mkdir /media/brontosaurnas/folder_name

# Copy the file over
cp downloads/folder_name/ /media/brontosaurnas/folder_name
```

### Starting the Stack with Gluetun

Gluetun is an [open-source](https://github.com/qdm12/gluetun) tunnel that is deployed as a docker container. It allows a docker stack to have a dedicated VPN connection. I currently use NordVPN and followed its published [Gluetun wiki entry](https://github.com/qdm12/gluetun-wiki/blob/main/setup/providers/nordvpn.md) for establishing a VPN connection. 

The first thing we have to do is find our public IP address. To do this from the virtual machine: 

```
# Output the current public IP address
curl -s https://ipinfo.io/ip
```

With that information on hand, we can setup and launch the docker stack. I first did it with just the Gluetun container. Once the Gluetun container has spun up, we can check confirm that the stack is communicating with the Internet via the VPN:

```
# Exec into the container
docker exec -it bf77b54a53ba sh

# Find the public IP of the container
wget -qO- https://ipinfo.io
```

As long as the IP address is different from the public IP in the first step (or by searching for *what is my ip*), then the VPN connection has been successfully established. 

The rest of the docker-compose file is setup such that the other containers access the Internet via the Gluetun container. This is done by adding the `network_mode: "service:gluetun"` line under each service. 

The rest of the stack can now be added to the docker-compose file. The torrent program of choice here is Deluge. This is because the WebUI for Deluge includes the IP it is using to access the Internet in the bottom-right corner. I like the peace of mind that being able to quickly confirm the stack is connected via the VPN each time I open the program. 

#### Automate container restart to renew IP

With the complete stack up and running it's possible to [skip ahead to setup](/projects/media-server#complete-the-servarr), but I have added a cronjob which restarts the stack every morning at 3:30 AM. I do this mostly to ensure that the VPN connection hasn't timed out and that the stack is always behind a fresh VPN connection. 

On the virtual machine hosting the stack, I created the following script called `restartContainers.sh`:

```
#!/bin/bash

DOCKER_DOWN="docker-compose down"
DOCKER_UP="docker-compose up"

# Set up authentication
export DOCKER_CONTENT_TRUST=0
export DOCKER_USERNAME="username"
export DOCKER_PASSWORD="password"

cd /home/servarr/servarr

# Run the Docker command
$DOCKER_DOWN

sleep 15

$DOCKER_UP
```

This script simply runs the docker-compose down command, waits 15 seconds, and runs the docker-compose up command. This refreshes the containers and therefore the VPN connection. 

With the script created, it's time to create a cronjob:

```
# Edit the crontab file
crontab -e

# Insert to run every morning at 3:30 AM
30 3 * * * path/to/restartContainers.sh 2>> path/to/logs.txt
```

With the cronjob created the complete stack will be spun down and back up every morning at 3:30 AM. Checking the public VPN via the Deluge via on consecutive days should now produce different IPs each day.

### Complete Servarr Setup

With confirmation that the VPN tunnel is working as expected, it's time to add the rest of the Servarr stack. 

#### Prowlarr

Prowlarr allows us to organize the indexes that the rest of the stack will use to find the correct files. It is not necessary, but the small extra step here streamlines management of the other containers in the Servarr stack. 

The first thing we have to do is setup authentication between Prowlarr and its sibling applications:

1. Under Settings > Apps, and add Sonarr. I left all of the default values and opened Sonarr in a new tab to find the API key.
2. In Sonarr, go to Settings > General > Security, and copy the API Key
3. Paste the API Key into Prowlarr, Test, and Save
4. Repeat 1 - 3 for Radarr

Now that Prowlarr has been setup to index for Sonarr and Radarr, it's time to setup Deluge:

1. Open Deluge in a new tab
2. Go to Preferences > Plugins, and check 'Label' then 'Apply' and 'OK'
3. Back in Prowlarr, go to Settings > Download Clients, and add Deluge. Again I like to use the default values except for 'Add Paused'

Under Indexers, we can add any number of torrent or nzb sources. These are the sites and services that will be used for the search for and acquisition of media files.

#### Sonarr / Radarr

Setting up Sonarr and Radarr from here is straight forward:

1. Under Settings > Media Management, check 'Rename Episodes' (Sonarr) or 'Rename Movies' (Radarr)
2. Check 'Unmonitor Deleted Episodes/Movies'
3. Under Download Clients, add Deluge and once again I used the default values except for 'Add Paused'

Sonarr and Radarr can now be used to search for the movies and TV shows I own, so that I can leverage my home network to watch them without Internet access or requiring a DVD player. 

#### Bazarr

Now that we can search for our media, it's time to find our subtitles. Bazarr is another sibling piece of open-source software to do just that. It leverages the OpenSubtitles.org API to find missing subtitles for all of the files in our library. Since Bazarr was pointed to the media location for our files, it will scan those directories to find which files are missing subtitles.

All of the following will be done under the 'Settings' menu.

First, we need to add the languages to track in the 'Languages' section. In the 'Language Filter' field, choose which languages should be queried. In the 'Languages Profiles' subsection, click 'Add New Profile' and create one for each language you might need. 

In the 'Providers' option, we want to Add 'OpenSubtitles.org' with proper credentials, and I have also added 'Subscenter', 'Supersubtitles', 'TVSubtitles', and YIFY Subtitles'.

Under the 'Subtitles' section, toggle 'Common Fixes' on. I also like to turn off the 'Use Embedded Subtitles' option to force a download. I have found these subtitles load more reliably than some of the embedded ones, so this ensures that we have subtitles available. 

Finally, we need to connect ro Sonarr and Radarr in a similar way that we did with Prowlarr above. In each of their respective sections, enable the service toggle and paste the API key from the appropriate service. I like to enable 'Download Only Monitored' to not download unnecessary subtitles and then setup the Path Mapping. The Path Mapping should be /tv/ for both Sonarr and Bazarr (or /movies/ for Radarr) if nothing changed in the docker-compose file. 

Now the stack is complete and we can search for our media files and have subtitles be found for them automatically. 

#### Jellyfin

Last, but certainly not least, is setting up the Jellyfin client so we can watch our media. Jellyfin should be setup as a separate docker stack and even better on a separate virtual machine. This is to isolate the tasks and prevent interruption if someone happens to be watching at 3:30 AM when the stack is scheduled to restart. 

Once the container is spun up, access the WebUI and create an admin user. Through the setup process or go to the 'Dashboard' then 'Libraries' to add the media libraries. The internal container paths to these should be mapped under the `volumes` section of the jellyfin docker-compose file. The 'Content Type' and 'Display Name' fields help with presenting the media and after selecting the correct folder for the media, I like to check 'Save artwork into media folders' to keep the files neat and organized together. 

The last thing to do for the server setup is to create users and setup the client devices. If the client devices cannot find the server through discovery, manually add the IP of the server with the port Jellyfin was setup on (8096 by default).

Now the entire pipeline has been established: we can search for digital copies of the media we phycally own, download copies of that media which has its subtitles found and appropriately sorted, available to watch through the Jellyfin app.




1. Fix media/docker-compose.yaml to remove Jellyfin
2. Add Jellyfin somewhere else
3. Fix grammar and voice
4. Take photos

