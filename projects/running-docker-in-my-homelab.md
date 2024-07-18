---
title: 'Running Docker in my Homelab'
featured: 'no'
published: '2023-03-05'
updated: '2024-07-17'
repo: 'https://github.com/JustinMountain/docker-compose'
category: 'repository'
tags: 'linux, homelab, docker'
excerpt:  "Docker is a powerful virualization tool that allows us to deploy containerized applications. Application dependencies are part of the container rather than the host operating system, making containerized applications easily reproducible and independent from one another."
excerpt2: "This documentation explains how I use some of the different features and capabilities of Docker in my homelab. If you're interested in checking out the different services that I'm running, check out the GitHub repository."
thumbnail: 'docker-container-list.jpg'
thumbalt: 'Docker containers can be managed through Portainer'
---

### Table of Contents

### 🐋 Docker Setup

> These notes are about how I use Docker in my homelab. If you're interested in checking out the different services that I'm running, check out the [GitHub repository](https://github.com/JustinMountain/docker-compose)

What is Docker? Simply put, Docker let's us add containers that include everything needed for an application to run. This streamlines the setup process for applications because we don't need to worry about installing dependencies or having different versions of the same dependency on one system - everything we need is packaged in the container. Containers are also independent of the host operating system and therefore work the same regardless of the Operating System they are being run on. 

In addition to being isolated from the host OS, containers are also isolated from other containers. This means, for example, there's no conflict having two different MySQL databases, each with their own `Users` table, because the two databases have no idea the other exists. It's possible to solve this problem with virtual (or physical) machines, but that solution requires a lot more technical overhead than simply deploying a container.

Installing Docker is relatively simple, just follow the [instructions on Docker's website](https://docs.docker.com/engine/install/ubuntu/) using the **Install using the repository** section. 

> As of 2024 July, I'm now using [Jeff Geerling's Anisble role](https://galaxy.ansible.com/ui/standalone/roles/geerlingguy/docker/) to install Docker.

One *nice to have* is adding the current user to the docker group. This allows docker commands to be run without `sudo` and entering a password. Use this with intention and restart the host after running the prompt to have the changes come into effect:

```
# Add user to the docker group if not done during docker setup
sudo usermod -aG docker $USER
```

### 📝 Using Docker Compose

The `docker compose` command allows us to pre-define parameters for a new docker container in a `compose.yaml` or `compose.yml` (previously `docker-compose.yml/yaml`) file. When using `docker compose` in this way, it is important that the containers are declared before the are necessary. In my [Nextcloud compose file](https://github.com/JustinMountain/docker-compose/blob/main/Nextcloud/docker-compose.yaml), for example, the declaration of the Postgres container must come before the Redis container because Redis is dependent on Postgres to function. The Nextcloud container requires both and is itself a requirement for the Nginx container.

In general, a `compose.yml` file will look like this:

```
services:
  name:
    image: image/name:version
    container_name: name
    environment:
      - VARIABLE=var
      - TZ=${TZ}
    volumes:
      - mydata:/app/data
    ports:
      - 3000:3000 # host:container
    restart: unless-stopped
```

By declaring the variables and parameters of a container in a file, it provides an easy reference for all of the initialization settings as well as a way of easily reproducing containers with the same settings. These benefits could also be done by writing the traditional docker commands in a script - something I will certainly be exploring in the future - but there's something to be said about the readability of `.yml` files. Speaking of readability, there are two things worth highlighting:

### 🌳 Environment Variables

Passwords are stored inside `.env` files sibling to each `compose.yml`:

```
# inside ~/container

# .env contains the variable declaration 
TZ=America/New_York

# docker-compose.yaml uses the environment variable to setup the container
TZ=${TZ}

# Check correct association for passwords from inside directory with
  # This will output the password inside .env to the command line!
docker compose convert
```

### 📦 Volumes

Docker volumes allow us to map data from the host machine into the container, which allows data to persist across container restarts. We do this by creating a directory on the host machine and mapping it to the container in the `compose.yml`. Not only is the data persistent, but it is accessible to other containers and easily backed up. 

Most of the time docker volumes are used to store configuration files or other files that are necessary for the containers to run as expected. All of the services below will be using docker volumes.

There are two ways to manage docker volumes: 

1. Use `docker volume create` to have docker manage the volume:

```
# Create the volume
docker volume create mydata

# Inside docker-compose.yaml
service:
  service-name:
    volumes:
      - mydata:/app/data

volumes:
  mydata:
```

2. Map to a directory on the host

```
# Create the volume
mkdir mydata

# Inside docker-compose.yaml
service:
  service-name:
    volumes:
      - /path/to/mydata:/app/data
```

In general, I like to make directories because it allows for a more simple [backup solution](/projects/storage-and-backup).

#### NFS Volumes

We can make docker volumes from NFS mounts. I have found this more reliable than mounting NFS to the host and mapping the directory via `compose.yml`. These NFS volumes are referenced the same as above, but their declaration requires some configuration:

```
volumes:
  volume-name:
    driver: local
    driver_opts:
      type: nfs
      o: addr=${NFS_SHARE_IP},rw,nfsvers=4,soft
      device: ":/path/on/share"
```

The options are fairly straight-forward, but a better explanation can be found in the [Docker documentation](https://docs.docker.com/storage/volumes/).

### 🛳️ Ports 

Port mapping is one of the most fundamental things to understand in Docker. Whatever service the container is running will be using a port, `3000` for Node.js or `80` for web servers, for example. Port mapping is essentially allowing the host computer to pass one of its ports to the docker container so that the service can be accessed from the host computer's IP.  

Mapping is `host:container` and the simplest way to understand its importantance is to imagine a situation where there are two containers that use port `3000`. These could be duplicate applications, different versions of the same application, or two applications both using Node.js. Port mapping allows us to avoid any conflict:

```
services:
  node-app-v1.0:
    ports:
      - 3000:3000 # host:container

  node-app-v1.1:
    ports:
      - 3001:3000 # host:container
```

Here we are exposing `v1.0` on the hosts port `3000` and `v1.1` on the hosts port `3001`.

### 📶 Networks

Docker networks are virtual networks that allow containers to communicate with each other. Containers that are connected to the same network can communicate with each other using their IP addresses, even if they are running on different Docker hosts.

This allows us to have multiple containers chained together. In the [WordPress example](https://github.com/JustinMountain/docker-compose/blob/main/Wordpress/docker-compose.yaml), we have a `docker-compose.yaml` file which contains three different containers: MySQL, phpmyadmin, and WordPress. By using docker networks, these three containers are effectively working together as an isolated set in their own network. Since our containers are kept on a separate network, there is no miscommunication between other copies of the same service. This makes it easier to build complex, distributed applications.

Without specifying network information in the `compose.yml` file, services in one stack of containers will share a default network. It is, of course, also possible to be declarative about the docker network. 

So far, I've found two ways to leverage docker networks:

1) Creating an external `proxy` network to use with [traefik](https://github.com/JustinMountain/homelab/blob/main/docker/traefik/compose.yml). By declaring the `proxy` network outside of the traefik stack, I can also connect to it with other stacks. New container stacks just need to connect to the external `proxy` network and have traefik labels added to add them to my internal reverse proxy.

2) Using `network_mode: "service:gluetun"` to route traffic within the container stack through the gluetun tunnel.

I imagine that it could also be used to create two networks within one stack, preventing separated containers from communicating, but I've not tested or looked into it.

### 🏗️ Dockerfile

I've only just started using Dockerfile, but it is the set of instructions to build an application into a container. There is a lot of nuance to understand, like caching layers, that I'm excited to learn about as I continue to learn about DevOps and Infrastructure as Code.
