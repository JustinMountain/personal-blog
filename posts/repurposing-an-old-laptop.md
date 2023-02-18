---
title: 'Repurposing an Old Laptop'
published: '2023-02-17'
updated: ''
tags: ''
excerpt: 'The first excerpt'
thumbnail: ''
---

## Repurposing an Old Laptop

> This isn’t a tutorial or a walkthrough. It’s my own documentation for how I setup the laptop to be a home server. 

### Table of Contents

### Laptop Specs

I still need to find and summarize this...

### Laptop Upgrades:

When I first had the idea to use this old laptop as a home server, I went through all the steps to make sure that it would work before spending money on a few small upgrades. Once the basics were setup and I was able to confirm that the laptop would function as I wanted it to, I decided to do a few upgrades since the machine will be running 24/7 and I want it to be a reliable tool for my home network as well as a resource to learn with. The two upgrades I did were replacing the old mechanical hard drive with an SSD and replace the thermal paste for better heat management. 

The bottom panel of this laptop has seen better days, as most of the screw retention clips have been broken off. The hard drive in this laptop has been replaced previously, and the tray that held it in place also broke. But this laptop will be sitting on a shelf as a server, not moving around. As long as I stay aware of the fact that the SSD isn’t secured, it should be fine. 

The heat sink couldn’t be completely removed, but I was able to lift it up enough and use rubbing alcohol with a cotton swab to remove all of the very old thermal paste. This laptop has two dyes that connect to the copper heat sink, so both were cleaned, and a small amount of new thermal paste was placed on them before the heat sink was secured back to the motherboard. The fan is in charge of dissipating the heat from the copper heat sink, so I took this time to give it a thorough cleaning as well. 

Once the two upgrades were complete, I did my best to find the last remaining retention clips and screwed the bottom panel back on the laptop. 

### Install Linux 

First, I need a Linux USB boot drive. This time around, I had one from the previous installation using Linux 22.04. I did so by following the following guide (https://ubuntu.com/tutorials/create-a-usb-stick-on-windows#1-overview). 
Plug the newly created Linux boot drive into the laptop, boot up, and follow the onscreen instructions to install Linux. I used the minimum installation option, since I didn’t want or need the extras installed on the server. I named the server and user veloserver, following my dinosaur themed naming convention. 

Once on the desktop, I navigated to the Wired Connection Settings to set a static IP address for the server. I’ve got a very standard networking setup, so I chose 102.168.1.100 for the server’s IP, 255.255.255.0 for the subnet mask, and 192.168.1.1 for the default gateway. These values may be different for different routers, but the subnet mask and default gateway have been these values for every router I’ve accessed.

With the basic setup complete, it’s time to turn this laptop into a server. Open the terminal (CTRL+ALT+T) and type ‘sudo apt update’ to download the latest package information. Then we run ‘sudo apt install openssh-server’ to be able to access and control the server from another machine on the network. We also needs to run ‘sudo systemctl status ssh’ to verify that ssh is running. 

Before we’re done on the laptop, we need to make sure it won’t shut down when we close the lid. Again in the terminal, type ‘sudo nano /etc/systemd/logind.conf’ and the file will open in the nano text editor. Navigate down to where it says ‘#HandleLidSwitch=suspend’ which is commented out. Remove the # and change suspend to ignore ‘HandleLidSwitch=ignore’. Make sure the changes are saved and nano has been closed. 

Now for the moment of truth: open PowerShell (or OpenSSH or PuTTY, etc) and type ‘ssh veloserver@192.168.1.100’. Enter the password made during the Linux installation. We should now have access to the command line of the server. To make sure everything is working, reboot the server (sudo reboot). When the server is back up and the login page displayed, close the lid. SSH back into the server (ssh veloserver@192.168.1.100) to make sure and now we can start to do some fun things with our server! 

### Next Steps

With the veloserver now active on the network, we can do some fun things. The first thing I’ll do is setup Docker to containerize the server processes. Inside Docker, we’ll install PiHole to keep telemetry and advertising at a minimum. 

Like any good project, doing this has created more a few more questions. What services can I self-host? Are there any services that I definitely shouldn’t self-host? 

While I was inside the laptop, I also noticed that I can easily remove the DVD drive. I wonder if I could buy an adapter and replace the DVD drive with a second SSD, creating a mirrored boot drive. It would be a shame to create a bunch of services and tie them to this laptop and have the SSD fail. 
I’ve done this as a way of exploring and learning about systems and networking. 
