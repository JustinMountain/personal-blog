---
title: 'Running Docker in my Homelab'
featured: 'yes'
published: '2023-03-05'
updated: '2023-03-28'
repo: 'https://github.com/JustinMountain/docker-compose'
category: 'repository'
tags: 'linux, homelab, docker'
excerpt: "Docker is a powerful virualization tool that let's us deploy containerized applications. Learn more about how I implement docker in my homelab."
thumbnail: 'docker-container-list.jpg'
thumbnail-alt: 'List of the docker containers in my homelab'
---

## Running Docker in my Homelab 

[![List of the docker containers in my homelab](docker-container-list.jpg "Docker containers via Portainer")](docker-container-list.jpg)
*Docker containers can be managed through Portainer.*

### Table of Contents

### 🐋 Docker Setup

What is Docker? Simply put, Docker let's us add containers that include everything needed for an application to run. This streamlines the setup process for applications because we don't need to worry about installing dependencies or having different versions of the same dependency on one system - everything we need is packaged in the container. Containers are also independent of the host operating system and therefore work the same regardless of the Operating System they are being run on. 

In addition to being isolated from the host OS, containers are also isolated from other containers. This means, for example, there's no conflict having two different MySQL databases, each with their own `Users` table, because the two databases have no idea the other exists. It's possible to solve this problem with virtual (or physical) machines, but that solution requires a lot more technical overhead than simply deploying a container.

Installing Docker is relatively simple, just follow the [instructions on Docker's website](https://docs.docker.com/engine/install/ubuntu/) using the **Install using the repository** section. The only notable point here is that I had to manually install `docker-compose`, an additional package that let's us define container settings using yaml files:

```
sudo apt install docker-compose
```

Another *nice to have* is adding the current user to the docker group. This allows docker commands to be run without `sudo` and entering a password. Use this with intention and restart the host after running the prompt to have the changes come into effect:

```
# Add user to the docker group if not done during docker setup
sudo usermod -aG docker $USER
```

### 📝 Using Docker-Compose

The `docker-compose` command allows us to pre-define parameters for a new docker container in a `.yaml` file. Its primary functionality is to define and configure stacks of docker containers to work together in an easy-to-read and unified location. When using `docker-compose` in this way, it is important that the containers are declared before the are necessary. In my [Nextcloud docker-compose.yaml](https://github.com/JustinMountain/docker-compose/blob/main/Nextcloud/docker-compose.yaml), for example, the declaration of the Postgres container must come before the Redis container because Redis is dependent on Postgres to function. The Nextcloud container requires both and is itself a requirement for the Nginx container.

That is not the only benefit that using `docker-compose` can bring to the homelab. By declaring the variables and parameters of a container in a file, it provides an easy reference for all of the initialization settings as well as a way of easily reproducing containers with the same settings. These benefits could also be done by writing the traditional docker commands in a script - something I will certainly be exploring in the future - but there's something to be said about the readability of `.yaml` files. Speaking of readability, there are two things worth highlighting:

1. Passwords are stored inside `.env` files sibling to each docker-compose.yaml:

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

2. Mapping is `host:container`.

```
# The 'data' directory maps to the 'app/data' directory inside the container.
volumes:
  - ./data:/app/data
```

### 📦 Volumes

Docker volumes allow us to map data from the host machine into the container, which allows data to persist across container restarts. We do this by creating a directory on the host machine and mapping it to the container in the `docker-compose.yaml`. Not only is the data persistent, but it is accessible to other containers and easily backed up. 

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

2. Create a directory on the host

```
# Create the volume
mkdir mydata

# Inside docker-compose.yaml
service:
  service-name:
    volumes:
      - /path/to/mydata:/app/data
```

Each method has benefits and drawbacks, but I like to make directories because it allows for a more simple [backup solution](/posts/storage-and-backup).

### 📶 Networks

Docker networks are virtual networks that allow containers to communicate with each other. Containers that are connected to the same network can communicate with each other using their IP addresses, even if they are running on different Docker hosts.

This allows us to have multiple containers chained together. In the [WordPress example](https://github.com/JustinMountain/docker-compose/blob/main/Wordpress/docker-compose.yaml), we have a `docker-compose.yaml` file which contains three different containers: MySQL, phpmyadmin, and WordPress. By using docker networks, these three containers are effectively working together as an isolated set in their own network. Since our containers are kept on a separate network, there is no miscommunication between other copies of the same service. This makes it easier to build complex, distributed applications.
