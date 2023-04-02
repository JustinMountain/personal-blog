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
Files are stored on my NAS. In order to enable cross-platform file sharing, I installed cifs-utils. I can't recall if this was a necessary step, but it's in my notes and I will check next time I setup a system.

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

> Write this one!