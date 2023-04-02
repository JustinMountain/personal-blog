---
title: 'Monitoring with Uptime Kuma'
published: '2023-03-28'
updated: '2023-03-28'
repo: ''
category: 'documentation'
tags: 'linux, homelab, docker'
excerpt: "Uptime Kuma is a free and open source netowrk monitoring utility."
thumbnail: 'uptime-kuma-dashboard.jpg'
thumbnail-alt: 'Dashboard of Uptime Kuma in my homelab'
---

## Monitoring with Uptime Kuma

[![Dashboard of Uptime Kuma in my homelab](uptime-kuma-dashboard.jpg "Uptime Kuma Dashboard")](uptime-kuma-dashboard.jpg)
*Dashboard view of my homelba in Uptime Kuma.*

### Monitoring Basics

As the complexity of the homelab increases, it's going to become more and more difficult to understand what is going on at a glance. One of the solutions I've already deployed is the Portainer service to monitor the [Docker containers that I'm locally hosting](/posts/running-docker-in-my-homelab). While a good solution for being able to access the logs and other pieces of information about individual containers, it isn't the most elegant solution for understanding at a glance which services are functioning as intended; enter Uptime Kuma.

Uptime Kuma allows me to setup a whole assortment of different monitors, create alerts on those monitors which send webhooks to a plethora of different services, and setup dashboards for easy to understand graphs showing which services are up and which are down.

### 🏓 Monitoring via Ping

Ping is a simple network diagnostic tool that sends a small packet of data to a target device and waits for a response. This data is then echoed back to the sender, confirming the connection and the ability of the target device to receive and respond to network traffic.

Ping is commonly used to test the reachability of a device on a network, to measure the round-trip time for messages sent from the originating host to the destination computer, and to identify problems with network connectivity. If there is no response to a ping, it may indicate a problem with the target device, such as a malfunctioning network interface or misconfigured software, or an issue with the connection to the target device, such as a broken cable, misconfigured network settings, or a firewall blocking the communication.

By scheduling periodic pings to a target device (called the *heartbeat interval* in Uptime Kuma), we will be able to track whether or not the service is responding to requests. I'm using Ping to monitor the devices on my network.

### 🔢 Monitoring via Port

TCP port monitoring involves regularly checking if a specific port on a network device is open and responding to traffic. This can be useful for monitoring the availability and performance of critical network services, such as web servers, email servers, and database servers. 

I'm using TCP Port to monitor the different services on my devices. Monitoring each service in this way will give me more granular information about any potential downtime.

### 🌐 Monitoring via HTTP (with keywords)

HTTP(s) monitoring involves checking if a web server is available and responding correctly to requests. It works by sending a GET or POST request to a specific URL on the server and analyzing the response code. A response code of 200 indicates that the server is functioning properly, while a response code of 400 indicates a client-side error (I messed up). A response code of 500 indicates a server-side error (the server messed up).

With Uptime Kuma, we're able to expand the HTTP(s) monitoring to include keywords from the page as well. This means that not only did the server respond, but it responded with the expected content. 

This type of monitoring is best suited for ensuring that web applications and services are available and performing optimally. I'm monitoring my portfolion site this way to make sure that it's online and available should someone find their way to it.

### 🔎 Monitoring DNS Resolution

DNS resolution monitoring involves checking if a domain name can be resolved to an IP address correctly. Monitoring DNS resolution in this way will help let me know if my Pi-hole is correctly forwarding DNS resolutions to its resolution server. I have chosen to monitor *google.com*, using my router as the resolution server because it points to the Pi-hole DNS sinkhole which points to a public resolver. 

In a future project, I'll be self-hosting DNS resolution with Unbound and having a DNS monitor in this situation will he me keep track of whether or not unbound is working correctly. 

### 🐋 Monitoring Docker Containers

Uptime Kuma has a monitoring solution specifically for Docker containers which is helpful because some containers cannot be reached by any of the previously mentioned methods. Monnitoring Docker containers directly takes some extra setup, but once that is complete it happens automatically in the background like all of the other monitor types.

On the Docker host server:

```
# Navigate to the following directory:
cd /etc/docker/

# Create daemon.json
sudo nano daemon.json

# Paste the following, change port as necessary
{"hosts": ["tcp://0.0.0.0:2375", "unix:///var/run/docker.sock"]}

# Create directory to hold revised Docker startup configuration
sudo mkdir /etc/systemd/system/docker.service.d/
cd /etc/systemd/system/docker.service.d/
sudo nano override.conf

# Paste the following into override.conf
[Service]
 ExecStart=
 ExecStart=/usr/bin/dockerd --config-file /etc/docker/daemon.json

# Reload the daemon and Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

With the setup complete on the Docker host server complete, there's now a little configuration required in Uptime Kuma before we can monitor our containers:

1. Navigate to Settings > Docker Hosts > Setup Docker Host
2. Choose a friendly name for the Docker host (`veloserver.docker`)
3. Choose TCP / HTTP for 'Connection Type'
4. Input the server's network address and the port declared in daemon.json (`http://192.168.1.100:2375`)
5. Test and Save the settings

Finally we can setup a monitor for our Docker containers. When adding a new monitor of this type, make sure to use the exact container name or ID and to select the Docker Host from the drop-down menu.

I'm using this solution to monitor the MySQL server that has been setup for my WordPress Playground. The WordPress Playground stack requires MySQL, phpmyadmin, and WordPress, however, MySQL is not a pingable service nor is it directly associated with a port. By monitoring the container itself, I have more granular details about the uptime status on my WordPress Playground. 

### 📋 Creating a Status Page

[![Status page of key services in my homelab](uptime-kuma-status-page.jpg "Status Page")](uptime-kuma-status-page.jpg)
*Status page of key services in my homelab.*

Another cool feature of Uptime Kuma is the ability to create and share customized dashboards. Navigate to 'Status Pages' and select 'New Status Page.' Give the dashboard a name such as 'Local Services,' set its slug, and click 'Next.' 

Here we can add different monitors and create groups for them. On my status page, I set up one for clients and another for services. To differentiate the status page from the dashboard I didn't include any of WordPress's dependencies. Both the description and footer text can be styled with markdown which means we can add links and images to our status pages as well. 

The last cool feature of the dashboard pages is the ability to create an incident report. If something goes down in the homelab and you know about it, you can let people know you're working on a solution. The incident description accepts markdown styling and has a few styles to choose from, like info and danger. 

### ❕ Sending Notifications

I don't want to constantly have Uptime Kuma running in my browser; sure it's nice to have access to this data but Uptime Kuma as a monitoring solution really shines when it comes to notifications. There is a a large list (Telegram, Teams, Slack, Email to name a few) of services that it can be configured to work with, but I'll be using a simple Discord bot for now:

1. Create new text channel for the alerts
2. Click on the gear icon to edit channel
3. Select Integrations > Webhooks > New Webhooks
4. Give it a name such as "Uptime Kuma"
5. Copy the webhook URL provided

With Discord setup we can go back to Uptime Kuma and start to configure our notifications settings:

1. Navigate to Settings > Notifications > Setup Notification 
2. Under Notification Type select Discord
3. Put the desired notification contents inside Friendly Name
4. Paste the webhook URL from Discord
5. Input the Bot Display Name created above, "Uptime Kuma"
6. Test and Save

I've got this setup to send notifications when the clients in my network go down. At this point, if either of my homelab clients go down then I'm probably playing with them and it will be a way to monitor my activities in real time. It's also there in case something does happen, I get notified about when and what went down.

### ⏩ Moving Forward

It would be nice to be able to access one of the status pages remotely. I could link an appropriate status page in the Discord message, so if i was out then in addition to being able to know that there's an issue, I would be able to see some stats instantly so I can start at least thinking about the problem. 

Doing so requires more learning and exploring in networking and firewalls, which is unfortunately a little further down the list than next.
