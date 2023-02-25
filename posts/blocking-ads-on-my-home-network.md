---
title: 'Blocking Ads on My Home Network'
published: '2023-02-23'
repo: ''
category: 'homelab'
tags: 'pi-hole, docker, linux, home server, documentation'
excerpt: 'The second excerpt'
thumbnail: ''
---

## Blocking Ads on My Home Network

### Table of Contents

### Why Block Ads?

I've been using an in browser ad blocker for as longas I knew they existed. They do the job they're supposed to do and they do it very well; they even do it better than the solution outlined below. The problem is that they only work in the browser. However, they won't block application telemetry nor will they work on mobile devices. I wanted a solution that would work for all devices on my local network. Enter Pi-hole.

Originally designed to work with Raspberry Pis, Pi-hole is a DNS sinkhole that works by intercepting DNS requests and checking if they match a list of blacklisted domains. If the requested site is on the list, the Pi-hole returns null. Pi-hole can do a numch of other things like handle DHCP and create local DNS, but here I'll be focusing on setting it up as a DNS sinkhole. I'm also using [my repurposed laptop](/posts/repurposing-an-old-laptop) instead of a Raspberry Pi using Docker.

### Docker Setup

What is Docker? Simply put, Docker let's us add containers that include everything needed for an application to run. This streamlines the setup process for applications because we don't need to worry about installing dependencies or having different versions of the same dependency on one system - everything we need is packaged in the container. Containers are also independent of the host operating system and therefore work the same regardless of the OS they are being run in. Containers are isolated from the host machine as well as other containers so for example there's no conflict having two different MySQL databases each with their own 'Users' table because the two databases have no idea the other exists. It's possible to solve this problem with virtual (or physical) machines, but that solution requires a lot more technical overhead than simply deploying a container.

Installing Docker is relatively simple, I just followed the [instructions on Docker's website](https://docs.docker.com/engine/install/ubuntu/) using the 'Install using the repository' section. The only notable point here is that I had to manually install docker-compose, an additional package that let's us define container settings using yaml files:

```
sudo apt install docker-compose
```

### Installing Pi-hole

With Docker installed, it's time to navigate to DockerHub and find the [official Pi-hole image](https://hub.docker.com/r/pihole/pihole). 

In the home directory of veloserver, I made a new directory for the Pi-hole files and opened a new docker-compose.yaml file in nano:

```
mkdir pihole
sudo nano docker-compose.yaml
```

I copied the provided docker-compose file into nano (right-clicking in the editor will paste the contents of the clipboard). There were a few small changes that needed to be made to this file: I changed the TZ to America/New_York, uncommented the WEBPASSWORD field, and added a password. There are some optimizations I can do to this docker-compose file, but those will be a problem for future Justin; time to save and exit out of nano.

Every time I have reached this stage of the installation, I've been greeted with an issue related to port 53, seemingly caused by Ubuntu's systemd-resolved service already running on port 53. I found a [post outlining a solution](https://discourse.pi-hole.net/t/docker-unable-to-bind-to-port-53/45082/7), and run the following commands:

```
systemctl disable systemd-resolved.service
systemctl stop systemd-resolved
```

**Explain what this does**

With the systemd-resolved issue resolved, it's time to run the docker-compose file:

```
sudo docker-compose up -d
```

This command spins up the container in detatched mode - basically just runs it as a background process rather than taking over the terminal. From here we should be able to run the following command to make sure that the new Pi-hole container is indeed up and running:

```
sudo docker ps
```

After a restart, it's now possible to access the Pi-hole admin panel from any web browser on the network [http://192.168.1.100/admin/](http://192.168.1.100/admin/) by using the password defined earlier in the docker-compose file that was used to build the Pi-hole container. 

### Adding Blacklists

Once in the admin panel, the next step is to update the blacklists. This step is completely optional, as Pi-hole does come with a default list, but doing so will vastly increase the number of IP addresses that the Pi-hole will block. Adding a new list is as easy as navigating to the Adlists section in the navigation and adding an address with a comment.

The simplest way that I found to add sites was to use the curated lists present on [The Firebog](https://firebog.net/). Blacklists here have different categories: green lists are the least likely to interfere with normal browsing, blue lists more aggressively block sites (I had one completely block Amazon), and lists with strikethrough text are deprecated or give false positives. Using just the green lists there are over 750,000 domains blocked on my network and I don't notice any negative effects when browsing. It's worth noting that it's not perfect - the YouTube app will still deliver ads to my phone, but I don't use the app often and they are taken care of in my desktop browser with [uBlock origin](https://ublockorigin.com/). 

Now that the Pi-hole is setup, it's time to tell the devices on our network to use it as their DNS provider. There are two options here and each have their own pros and cons:

1) Configure each individual device's DNS settings
2) Tell the router to resolve all DNS queries through the Pi-hole

Pointing each device to the Pi-hole will collect more granular data about which device is making which query. Telling the router is much simpler, but not all routers can be setup with this functionality. I've gone with a combination of both soltions: a lot of my devices have their connections manually configured, and I also point my home router (an Archer C7 and flashed with the OpenWRT firmware) to the Pi-hole. This makes sure the network is covered and also lets me know when different devices are phoning home at different intervals. 

On my Archer C7:

1) Click Network > Interfaces
2) On WAN, click edit > Advanced Settings
3) Uncheck the ‘Use DNS servers advertised by peer’ option, add 192.168.1.100 to ‘Use custom DNS servers’ and save
4) Click on ‘Interface has pending changes’ and Save & Apply. 
5) System > Reboot from the navigation bar to ensure that all of the settings are active. 
6) The network should be covered by PiHole! 

It's important to note that this does not provide complete network security. This protects against DNS requests but if a device has the DNS hard-coded into it, the PiHole will not stop the requests from exiting the network. This is a job better suited for a Firewall or DMZ. 

> I need to add a conclusion here pointing to the next article
