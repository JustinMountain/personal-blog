---
title: 'Blocking Ads on My Home Network'
published: '2023-01-18'
updated: ''
tags: ''
excerpt: 'The second excerpt'
thumbnail: ''
---

## Blocking Ads on My Home Network

### Table of Contents

### Install Docker

First thing’s first, Docker will allow us to add containers. Containers are like application packages that include everything needed for the application to run. Docker containers have the benefit of being isolated from the host machine as well as one another. This isolation mainly allows the different applications on the machine to run without knowledge of one another, which can clean up some interference when running multiple applications. For example, if there are two applications installed which both require a database, the two databases will be completely isolated. This allows us to have two tables with the same names in each database or even different versions of the same database, each linked to a different application.

To install Docker, I just followed the instructions on Docker’s website (https://docs.docker.com/engine/install/ubuntu/). I had to manually install docker-compose (sudo apt install docker-compose). On subsequent installs, I’ll still follow the guide and check the version of docker and docker-compose before manually installing it. 

### Install PiHole

Now that Docker has been installed, we can finally install PiHole. Once again, I just followed the instructions on Docker Hub (https://hub.docker.com/r/pihole/pihole). 

After SSHing into veloserver, I created a directory to store the PiHole instance (mkdir pihole). After changing into the new directory, I created a new docker-compose.yml file and opened it in nano (sudo nano docker-compose.yml). I copied the provided file into nano, changing the TimeZone to New_York, uncommenting the WEBPASSWORD field and added a password. Check this. 

After saving exiting out of nano, run the compose command.

Every time I get here, I run into an issue with port 53. Luckily, I was able to find this post (https://discourse.pi-hole.net/t/docker-unable-to-bind-to-port-53/45082/7) which gave me the following commands and fixed the issue:

```
systemctl disable systemd-resolved.service
systemctl stop systemd-resolved
```

Once these are done, we run ‘sudo docker-compose up -d’ to start the containers. 

After a restart, I can now access the pihole admin panel from any web browser on the network (http://192.168.1.100/admin/login.php) by using the password defined in the docker-compose file used to build the PiHole container. 

Once inside, the next step is to update adlists. This step is completely optional, but doing so will vastly increase the number of IPs that the PiHole will block. I just used the lists on the firebog (https://firebog.net/) website. By adding all of the green and blue lists (I added a comment in PiHole to indicate which type of list each link was protecting against – advertising, telemetry, etc) I was able to get over 5.7 million blocked IPs. 

Finally, the PiHole is up and running as a DNS sinkhole. Now that it’s setup, we just need to tell the devices on our network to use the PiHole as their DNS provider. There are two ways to do this: we can go into the setting for each network device and put 192.168.1.100 as the DNS provider, or we can tell our router to use the PiHole for the entire network. The first option is more work to setup (and maintain – if the PiHole’s IP changes then each devices will need to be manually updated) but it provides more granular information about what’s happening on the network – which devices are making which DNS queries. The second option provides total coverage for the network, but finding the rogue devices calling home a million times will be much more difficult. 

I have an Archer C7 router with the OpenWRT firmware installed. I can’t list out here how to configure custom DNS settings for every router, but it’s going to be a similar process for all routers. 

In the navigation, click Network > Interfaces. On WAN, click edit > Advanced Settings. Uncheck the ‘Use DNS servers advertised by peer’ option, add 192.168.1.100 to ‘Use custom DNS servers’ and save. Click on ‘Interface has pending changes’ and Save & Apply. I like to make sure everything is covered now by going to System > Reboot from the navigation bar. Once the router has restarted, the network should be covered by PiHole! 

It's important to note that this does not provide complete network security. This protects against DNS requests, if a device has the DNS hard-coded into it, the PiHole will not stop the requests from exiting the network. This is a job better suited for a Firewall or DMZ. 

I also like to point my devices to the PiHole. 











With veloserver now active on the network, we can do some fun things. The first thing I’ll do is setup Docker to containerize the server processes. Inside Docker, we’ll install PiHole to keep telemetry and advertising at a minimum. 
