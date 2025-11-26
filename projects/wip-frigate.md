---
title: ''
featured: 'no'
published: 'no'
updated: ''
repo: ''
category: ''
tags: 'networking, docker, linux, homelab, data management, proxmox, truenas, media, aws, cloud, nextjs, hardware, ansible, IaC, certification, monitoring, node, selfhosting'
excerpt: 'This should be a complete sentence.'
excerpt2: ''
thumbnail: 'article-template-splash.jpg'
thumbnail-alt: ''
---

### Table of Contents

### Camera Setup

I used a Reolink RLC-510A.

1. Connect camera to home nework and assign a static IP in the IoT VLAN. (Maybe I should make a separate camera vlan?)
1. Log in to camera, 
  1. Under System > User Management, change the admin password and add a `frigate` user
  1. Under Netowrk > Server Settings, enable RTSP and ONVIF

The camera stream was now visible at `rtsp://username:password@192.168.20.51/Preview_01_main`.

### Frigate Setup










### To Do

1. Meta data
  1. `featured` can only have 2-3
  1. `published` is `yyyy-mm-dd`
  1. `category`: documentation, repository (when adding a repo link)
  1. `tags` (add to `article-template.md` if creating new one):
  1. `excerpt2` is used in featured articles and in the article page. 
  1. `thumbnail` size is `1200x800`
1. Emojis in titles
1. Edit pass

### Adding a New Service to my Homelab

1. Add to Traefik (via labels or static config)
1. Add the DNS entry to PiHole
1. Add the service to Uptime Kuma for tracking
1. Add to Homepage for easy access

### Voice

Write as if I'm the audience. Literally telling myself what to do to recreate the project.

1. I did this.
1. Do this, then that.
