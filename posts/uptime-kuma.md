---
title: 'Monitoring with Uptime Kuma'
published: '2023-03-28'
updated: '2023-03-28'
repo: ''
category: 'documentation'
tags: 'linux, homelab, docker, monitoring'
excerpt: "Uptime Kuma is a free and open source network monitoring utility."
thumbnail: 'uptime-kuma-dashboard.jpg'
thumbnail-alt: 'Dashboard of Uptime Kuma in my homelab'
---

## Monitoring with Uptime Kuma

[![Dashboard of Uptime Kuma in my homelab](uptime-kuma-dashboard.jpg "Uptime Kuma Dashboard")](uptime-kuma-dashboard.jpg)
*Dashboard view of my homelab in Uptime Kuma.*

### Table of Contents

### 🛡️ Monitoring Basics

As the complexity continues to grow in my homelab, it's becoming more and more difficult to understand at a glance which services are functioning as intended; enter Uptime Kuma.

Uptime Kuma allows me to setup an assortment of different monitors, create alerts on those monitors which send webhooks to a plethora of different services, and setup dashboards for easy to understand graphs showing which services are up and which are down. All of this makes Uptime Kuma a great tool to provide insight into- and alerts for- my home network and the different public services I want to monitor.

This documentation assumes that Uptime Kuma has been setup and deployed. I have information about setting up and using docker [here](/posts/running-docker-in-my-homelab) or you can see the docker-compose.yaml file I use on [GitHub](https://github.com/JustinMountain/docker-compose/tree/main/UptimeKuma).

### 🏓 Monitoring via Ping

Ping is a simple network diagnostic tool that sends a small packet of data to a target device and waits for a response. This data is then echoed back to the sender, confirming the connection and the ability of the target device to receive and respond to network traffic. It's commonly used to test the reachability of a device on a network, to measure the round-trip time for messages sent from the originating host to the destination computer, and to identify problems with network connectivity.

By scheduling periodic pings to a target device (called the **heartbeat interval** in Uptime Kuma), I can track whether or not the service is responding to requests. Setting up a ping monitor is very straight-forward: 

1. Click on the **Add New Monitor** button
2. Select **Ping** from the **Monitor Type** menu
3. **Friendly Name** represents what we want to be displayed as the name of the service
4. **Hostname** is for the url or IP address to be pinged

Once the monitor is saved a ping will be sent out immediately and will recur every 60 seconds or whatever value was set for its *heartbeat interval*. 

### 🔢 Monitoring via Port

TCP port monitoring involves regularly checking if a specific port on a network device is open and responding to traffic. This can be useful for monitoring the availability and performance of critical network services, such as web servers, email servers, and database servers. 

In a similar way to how Ping is used above, it's possible schedule periodic pings to a server at a specific port. This allows me to monitor the services on my devices; just because a server is operational doesn't mean the services running on it are as well. Monitoring each service in this way gives me more granular information about any downtime.

To set up a TCP Port monitor follow the same steps as above, except:

1. Select **TCP Port** from the **Monitor Type** menu
2. **Port** represents the port to be checked

### 🌐 Monitoring via HTTP

HTTP(s) monitoring continues to expand on Ping and Port monitoring. Instead of just checking if the server is reponding, it checks whether it is available and responding as expected to requests. It works by sending a GET or POST request to a specific URL on the server and analyzing the response code. A response code of 200 indicates that the server is functioning properly, while a response code of 400 indicates a client-side error (I messed up). A response code of 500 indicates a server-side error (the server messed up).

With Uptime Kuma, it's possible to expand HTTP(s) monitoring to include keywords from the page as well. Valid responses mean that not only did the server respond, but it responded with the expected content. 

To set up an HTTP(s) monitor:

1. Select **HTTP(s)** from the **Monitor Type** menu
2. Input the **URL**
3. Describe the request or use the default options
4. *Optional* select **HTTP(s) - Keyword** from the **Monitor Type** menu
5. *Optional* input a **Keyword** to search for in the response

### 🔎 Monitoring DNS Resolution

DNS resolution monitoring involves checking if a domain name can be resolved to an IP address correctly. Monitoring DNS resolution in this way will help let me know if my [Pi-hole](/posts/blocking-ads-on-my-home-network) is correctly forwarding DNS resolutions to its resolution server. It could also let me know if the Pi-hole is working by checking against a domain that is on a blocklist.

To setup a DNS resolution monitor:

1. Select **DNS** from the **Monitor Type** menu
2. Input the domain you want to test resolution for in **Hostname**
3. Choose a service or address as the **Resolver Server** 

### 🐋 Monitoring Docker Containers

Some containers cannot be reached by any of the previously mentioned methods and luckily Uptime Kuma has a monitoring solution specifically for Docker containers. Monitoring Docker containers in this way requires some extra setup but once the setup is complete, it runs like all of the other monitor types.

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

With the setup complete on the Docker host server complete, there's now a little configuration required in Uptime Kuma before it's possible to monitor the containers directly:

1. Navigate to **Settings** > **Docker Hosts** > **Setup Docker Host**
2. Choose a friendly name for the Docker host (`veloserver.docker`)
3. Choose TCP / HTTP for 'Connection Type'
4. Input the server's network address and the port declared in daemon.json (`http://192.168.1.100:2375`)
5. Test and Save the settings

Finally, it's possible to setup a monitor for Docker containers. When adding a new monitor of this type, make sure to use the exact container name or ID and to select the Docker Host from the drop-down menu.

I'm using this solution to monitor the MySQL server that has been setup for a WordPress Playground). The WordPress Playground stack requires MySQL, phpmyadmin, and WordPress, however, MySQL is not a pingable service nor is it directly associated with a port. By monitoring the container itself, I have more granular details about the uptime status on my WordPress Playground. 

### 📋 Creating a Status Page

[![Status page of key services in my homelab](uptime-kuma-status-page.jpg "Status Page")](uptime-kuma-status-page.jpg)
*Status page of key services in my homelab.*

Another cool feature of Uptime Kuma is the ability to create and share customized dashboards. Navigate to **Status Pages** and select **New Status Page**. Give the dashboard a name such as 'Local Services,' set its slug, and click **Next**. 

Here we can add different monitors and create groups for them. Both the description and footer text can be styled with markdown which means we can add links and images to our status pages as well. 

Dashboards also have the ability to create an incident report. The incident description accepts markdown styling and has a few styles to choose from, like info and danger. 

### ❕ Sending Notifications

I don't want to constantly have Uptime Kuma running in the browser; sure it's nice to have access to this data but Uptime Kuma as a monitoring solution really shines when it comes to notifications. There is a large list (Telegram, Teams, Slack, Email to name a few) of services that it can be configured to work with, but I have set up a Discord bot which handles notifications for now. In Discord:

1. Create new text channel for the alerts
2. Click on the gear icon to edit channel
3. Select Integrations > Webhooks > New Webhooks
4. Give it a name such as "Uptime Kuma"
5. Copy the webhook URL provided

With Discord setup, go back to Uptime Kuma and start to configure the notifications settings:

1. Navigate to **Settings** > **Notifications** > **Setup Notification** 
2. Under **Notification Type** select **Discord**
3. Put the notification contents inside **Friendly Name**
4. Paste the **Discord Webhook URL** copied above
5. Input the Bot Display Name created above, "Uptime Kuma"
6. Test and Save

### ⏩ Moving Forward

It would be nice to be able to access one of the status pages remotely. I could link an appropriate status page in the Discord message, so if i was out then in addition to being able to know that there's an issue, I would be able to see some stats instantly so I can start at least thinking about the problem. 

Doing so requires more learning and exploring in networking and firewalls, which is unfortunately a little further down the list than next.
