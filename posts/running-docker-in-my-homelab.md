---
title: 'Running Docker in my Homelab'
published: '2023-03-05'
updated: '2023-03-05'
repo: ''
category: 'repo'
tags: 'linux, home server, documentation, homelab'
excerpt: "Docker is a powerful virualization tool that let's us deploy containerized applications. Learn more about how I implement docker in my homelab."
thumbnail: ''
thumbnail-alt: ''
---

## Running Docker in my Homelab 

### Table of Contents

### Docker Setup

What is Docker? Simply put, Docker let's us add containers that include everything needed for an application to run. This streamlines the setup process for applications because we don't need to worry about installing dependencies or having different versions of the same dependency on one system - everything we need is packaged in the container. Containers are also independent of the host operating system and therefore work the same regardless of the OS they are being run in. Containers are isolated from the host machine as well as other containers so for example there's no conflict having two different MySQL databases each with their own 'Users' table because the two databases have no idea the other exists. It's possible to solve this problem with virtual (or physical) machines, but that solution requires a lot more technical overhead than simply deploying a container.

Installing Docker is relatively simple, I just followed the [instructions on Docker's website](https://docs.docker.com/engine/install/ubuntu/) using the 'Install using the repository' section. The only notable point here is that I had to manually install docker-compose, an additional package that let's us define container settings using yaml files:

```
sudo apt install docker-compose
```

### Networks

Docker networks are virtual networks that allow containers to communicate with each other. Containers that are connected to the same network can communicate with each other using their IP addresses, even if they are running on different Docker hosts.

This allows us to have multiple containers chained together. In the [WordPress example](**I NEED THE LINK**), we have a docker-compose.yaml file which contains three different containers: MySQL, phpmyadmin, and WordPress. By using docker networks, these three containers are effectively working together as an isolated set in their own network. Since our containers are kept on a separate network, there is no miscommunication between other copies of the same service. This makes it easier to build complex, distributed applications

### Volumes

Docker volumes allow containers to persist data beyond the lifetime of a single container. We do this by creating a directory on the host machine and mapping it to the container. This allows the data to be persistent between container restarts, accessible to other containers on the docker network, and easily backed up. 

Most of the time docker volumes are used to store configuration files or other files that are necessary for the containers to run as expected. All of the services below will be using docker volumes.

### Services

Passwords are stored inside .env files sibling to the each docker-compose.yaml:

```
# .env
TZ=America/New_York

# docker-compose.yaml
TZ=${TZ}

# Check correct association for passwords from inside directory with
docker compose convert
```

#### Deluge

- 8112 for WebUI

Deluge is open-source torrent software that comes packaged with a Web UI, making it a perfect candidate as a self-hosted service. 

I made a downloads folder, then a completed folder nested inside that. The completed folder is mapped to the NAS. When a file completes downloading, Deluge is set to move the file in downloads/completed and therefore onto the NAS.

When any download completes locally then gets sent to the NAS.

#### Jellyfin

- 8096 for WebUI

Jellyfin is an open-source media streaming service; self-hosted Netflix. The Web UI is simple and intuitive, much like Netflix or any other streaming service.

The JELLYFIN_PublishedServerUrl variable is the discoverable address of the service. It's important to note here that port 8086 is necessary when navigating to the server in a web browser or on the iOS app.

Inside the jellyfin directory I made a config directory to map to the config files in the container for persistence.

#### Pi-hole

- /admin for WebUI

Pi-hole is a DNS sinkhole that I currently have setup on my local network. It's possible to set it up remotely or with remote access, however I've not explored that yet.

I wrote a complete article (link) about the installation and setup process.

Here are two sources that I need to investigate before final draft:
 - https://discourse.pi-hole.net/t/solved-dns-resolution-is-currently-unavailable/33725/6
 - https://bbs.archlinux.org/viewtopic.php?id=275976

#### Wordpress

- Port 8000 for site
- Port 8080 phpmyadmin
- Port 8000/wp-login

Wordpress is an open-source content management system (CMS). It's one of the most popular website services which uses MySQL and pmpmyadmin for its backend. 

The docker-compose file here contains three containers linked together through a docker network. Docker networks are a way of allowing containers to talk to one another, allowing multiple containers to be chained together while maintaining all of the benefits of containerized applications. 

> Figure out better way to display infor about ports

> edit pass
