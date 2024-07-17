---
title: "You Wouldn't Download a Media Server?!"
featured: 'no'
published: '2023-08-13'
updated: '2024-07-15'
repo: ''
category: 'documentation'
tags: 'linux, homelab, docker, media'
excerpt: 'Occupying the grey zone.'
thumbnail: ''
thumbalt: ''
---

### Table of Contents

### 🛞 Who's Steering the Ship?

After I self-hosted Nextcloud to [store my family's photos](/projects/storage-and-backup), I decided that I wanted to centralize media streaming in our home as well. We live in a bilingual house: English and Brazilian Portuguese. Brazilian Portuguese is rarely found on the streaming platforms and none of the DVDs that I own come with them. 

I am in no way advocating for piracy. If we want to watch a movie that we own, there is no easy and reliable way to do so in the way that is best for our family. Open source to the rescue! 

The media server that I have setup here is the Servarr or *arr stack. Everything is open-source and it allows our family to watch our movies in the way that works best for us. 

**Picture of Lord of the Rings DVDs**

This media server downloads media files and stores them in a centralized location. It generates meta-data for the media and downloads subtitles that suit the file. It then uses the Jellyfin app to broadcast and share the media locally on our home network. This enables our family to watch our media the way that works best for us. Again, I am in no way advocating for piracy [of any kind](/projects/blocking-ads-on-my-home-network).

The `compose.yml` file used for this server can be found on my [GitHub page](https://github.com/JustinMountain/homelab/tree/main/docker/servarr). 

### 🖇️ Network Mounting

I've used a virtual machine to host this servarr stack and I will be using the NFS feature on BrontosaurNAS to hold the files. NFS mounts are made inside `compose.yml` and an explanation on creating NFS mounts with Docker can be found [here](/projects/running-docker-in-my-homelab).

#### 🗒️ NFS Mount via fstab 

Prior to implementing NFS mounts directly in the `compose.yml` files, I mounted to the host system. I've decided to keep this information, but it is possibly outdated.

Setting up the NFS share:

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

### 🚇 Starting the Stack with Gluetun

Gluetun is an [open-source](https://github.com/qdm12/gluetun) tunnel that is deployed as a docker container. It allows a docker stack to have a dedicated VPN connection. I currently use NordVPN and followed its published [Gluetun wiki entry](https://github.com/qdm12/gluetun-wiki/blob/main/setup/providers/nordvpn.md) for establishing a VPN connection. 

The first thing we have to do is find our public IP address. To do this from the virtual machine: 

```
# Output the current public IP address of the host machine
curl -s https://ipinfo.io/ip
```

With that information on hand, we can setup and launch this first container. Since all of the other containers depend on this one, isolating it and knowing that it's working as expected is paramount. Once the Gluetun container has spun up, we can check confirm that the stack is communicating with the Internet via the VPN:

```
# Exec into the container
docker exec -it bf77b54a53ba sh

# Find the public IP of the container
wget -qO- https://ipinfo.io
```

As long as the IP address is different from the public IP in the first step, then the VPN connection has been successfully established. 

The rest of the `compose.yml` file is setup such that the other containers access the Internet via Gluetun. This is done by adding the `network_mode: "service:gluetun"` line under each service. 

The rest of the stack can now be added to the `compose.yml` file. 

#### Automate container restart to renew IP

With the complete stack up and running it's possible to [skip ahead to setup](/projects/media-server#complete-servarr-setup), but I have added a cronjob which restarts the stack every morning at 3:30 AM. I do this mostly to ensure that the VPN connection hasn't timed out and that the stack is always behind a fresh VPN connection. 

On the virtual machine hosting the stack, I created the following script called `restartStack.sh`:

```
#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

DOCKER_COMPOSE_FILE="$HOME/servarr/docker-compose.yml"
DOCKER_DOWN="docker-compose down"
DOCKER_UP="docker-compose up -d"  # Added -d for detached mode

# Check if docker-compose file exists
if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
    echo "Error: docker-compose.yml not found at $DOCKER_COMPOSE_FILE"
    exit 1
fi

cd ~/servarr

echo "Stopping containers..."
$DOCKER_DOWN
if [ $? -ne 0 ]; then
    echo "Error: Failed to stop containers"
    exit 1
fi

echo "Waiting for containers to stop..."
sleep 15

echo "Starting containers..."
$DOCKER_UP
if [ $? -ne 0 ]; then
    echo "Error: Failed to start containers"
    exit 1
fi

echo "$(date '+%Y-%m-%d %H:%M:%S') - Containers restarted successfully"
```

This script simply runs the `docker compose down` command, waits 15 seconds, and runs `docker compose up -d`. This refreshes the containers and therefore the VPN connection. 

With the script created, it's time to create a cronjob. I've now automated this step with [Ansible](https://github.com/JustinMountain/homelab/blob/main/ansible/roles/docker/cronjob_restart_stack/tasks/main.yml), however doing so manually requires just two steps:

```
# Edit the crontab file
crontab -e

# Restart servarr stack every 4 hours
0 */4 * * * ~/servarr/restartStack.sh >> ~/servarr/logs.txt 2>&1
```

With the cronjob created the complete stack will be spun down and back up every 4 hours.

### ✅ Complete Servarr Setup

With confirmation that the VPN tunnel is working as expected, it's time to add the rest of the Servarr stack. 

#### 🔽 qBittorrent

First, we need to figure out the default admin password for the container. We can do this by using `sudo docker logs qbittorrent` and finding the line in the logs showing the default passwsord. 

To change the password, go to **Tools** > **Options** > **Web UI**. Under **Authentication**, we can change the default password.

I like to change a few of the default settings as well, just to make things a little more supervised. Again under **Tools** > **Options** > **Downloads**, check "Do not start the download automatically" under **When adding a torrent**. The next line is "Torrent stop condition," where I like to choose "Files checked." This ensures that the final download of the torrent needs to be manually checked.

In the same **Tools** > **Options** > **Downloads** window, under **Saving Management**, I also ceck "Keep incomplete torrents in: /downloads/incomplete". This way it's easier to see at a glance from the NFS share location which files are left incomplete.

Previously, I used Deluge instead of qBittorrent. This was because the WebUI for Deluge includes the IP it is using to access the Internet in the bottom-right corner. I've changed, however, because I was able to add the darkmode extension for qBittorrent and not for Deluge.

#### 💡 Sonarr / Radarr / Lidarr / Readarr

Setting up the four content discovery applications is relatively straight forward:

First, under **Settings** then **Media Management**, check "Rename Episodes" for Sonarr or "Movies," "Tracks," and "Books" for Radarr, Lidarr, and Readarr, respectively. I also like to check "Unmonitor Deleted Episodes" (or its corresponding choice), though there doesn't seem to be one for Lidarr.

To connect these apps with qBittorrent, we should go to **Settings** then **Download Clients**, and add qBittorrent and using the default values.

Finally, we need to collect the various API keys that will allow us to centralize some of the management moving forward. Go to **Settings** > **General** > **Security** and scroll down to the API key and copy one for each of these applications, saving them in a note, since we'll need them in a couple of places later.

#### 🐯 Prowlarr

Prowlarr allows us to organize the indexers that the rest of the stack will use to find the correct files. It is not necessary, but the small extra step here streamlines management of the other containers in the Servarr stack. 

The first thing we have to do is setup authentication between Prowlarr and its sibling applications:

Under **Settings** then **Apps**, add each of the applications above one by one. The default values should be good enough, simply paste the API key and test the connection. 

Now we can add Indexers which are the sources for the torrents that will be downloaded and used. Go to **Indexers** and choose "Add Indexer" and then find one or more to add. Some require a workaround for CloudFlare DDoS protection, which is covered by FlareSolverr below.

With the Indexers setup, we can search and send downloads directly from Prowlarr by connecting it to qBittorrent by going to **Settings** then **Download Clients**, and adding qBittorrent using the default values. Through the APIs, however, all of the Indexers have been synced to each of the specialized applications and I believe they provide a better experience. The benefit here is that we add our Indexers all in one spot, rather than individually for each application. 

##### FlareSolverr

Some of the Indexers are behind CloudFlare DDoS protection, which prevents Prowlarr from accessing them. Luckily, FlareSolverr can get around this by creating an environment to forward requests through.

In Prowlarr, go to **Settings** then **Indexers** and under **Indexer Proxies**, add a new FlareSolverr proxy. Under the "Tags" option, add "FlareSolverr."

Now, when adding an Indexer, if there is a warning that the site uses CloudFlare DDoS protection, add the "FlareSolverr" tags in "Tags."

#### 📜 Bazarr

Now that we can search for our media, it's time to find our subtitles. Bazarr is another sibling piece of open-source software to do just that. It leverages the OpenSubtitles.com API to find missing subtitles for all of the files in our library. Since Bazarr was pointed to the media location for our files, it will scan those directories to find which files are missing subtitles.

All of the following will be done under the **Settings** menu.

First, we need to add the languages to track in the **Languages** section. In the "Language Filter" field, choose which languages should be queried. In the "Languages Profiles" subsection, click "Add New Profile" and create one for each language you added in "Language Filter."

In the **Providers** subsection, we want to Add 'OpenSubtitles.com' with proper credentials, and I have also added "Supersubtitles," "TVSubtitles" and "YIFY Subtitles."

Under the **Subtitles** section, I like to turn off the "Use Embedded Subtitles" option to force a download and I toggle "Common Fixes" on.  I have found these subtitles load more reliably than some of the embedded ones, so this ensures that we have subtitles available. 

Finally, we need to connect to Sonarr and Radarr in a similar way that we did with Prowlarr above. In each of their respective sections, enable the service toggle and paste the API key from the appropriate service. I like to enable "Download Only Monitored" to not download unnecessary subtitles and then save in order to setup the Path Mapping. The Path Mapping should be `/tv/` for both Sonarr and Bazarr (or `/movies/` for Radarr and so on) if nothing changed in the `compose.yml` file. 

Now the stack is complete and we can search for our media files and have subtitles found for them automatically. 

### 📺 Enjoying the Content

At the moment, music and books are being ignored. I just have this setup for Movies and TV Shows through a [Jellyfin](https://github.com/JustinMountain/homelab/tree/main/docker/jellyfin) server. We then use an app canned "Infuse" on our Apple TV to stream the content. I have not setup the Music and Book equivalents and don't really have any plan too. Adding Lidarr and Readarr was simply done as an exercise in completeness.

### 🥏 Future 

The next logical step is to complete the missing piece missing above and add servers for Music and Book content. This isn't a pressing need, however, as this type of content doesn't require the same multi-lingual synchronization that inspired the rest of the build. 

The server that I'm using to host this media stack has a DVD drive, so I would like a future project to be take further inspiration from [Jeff Geerling](https://www.youtube.com/watch?v=RZ8ijmy3qPo) and create a complete pipeline for backing up our DVDs. For now, we are relying on the community's help.
