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

### Intro

### Create an Unprivileged LXC

When creating the container, I made sure that both *Unprivileged container* and *Nesting* were checked, gave it a root password, and copied my public SSH key.

I used the Debian 12 Standard template, gave it 2 CPU cores with a limit of 2, 4096 MiB of memory with 1024 MiB of swap, setup the network configuration, and created the container. 

### iGPU Passthrough

#### Install Drivers

First, we need to make sure the iGPU drivers are installed on the Proxmox host:

```
apt update && apt upgrade
apt install intel-media-va-driver
apt install vainfo intel-gpu-tools 
```

After a reboot, in the Proxmox shell, use `vainfo` to confirm the drivers are installed correctly.

Turn on the LXC container that will have the iGPU passed to it and install the drivers there as well:

```
apt update && apt upgrade
apt install intel-media-va-driver 
apt install vainfo intel-gpu-tools 
```

Turn off the LXC.

#### iGPU Passthrough

Now we need to get the `video` and `render` gid from the Proxmox host:

```
# Get the video gid (44 on StegosaurNAS)
getent group | grep video

# Get the render gid (104 on StegosaurNAS)
getent group | grep render
```

In the Proxmox Web UI, select the appropriate LXC and select **Resources**  and choose **Add** > **Device Passthrough**. To ensure that the container will have the right permissions to access the passed-through iGPU, we add the device paths from the host and declare the GID and UID in the container to match what we have on the host:

```
# For StegorsaurNAS
/dev/dri/card0,gid=44,uid=0
/dev/dri/renderD128,gid=104,uid=0
```

Once we turn on and log in to the LXC, we need to add our root user to the `video` and `render` groups with:

```
usermod -aG video root
usermod -aG render root
```

At this point, the LXC should have access to the iGPU. `ls -l /dev/dri` should now show the following:

```
root@d12-igpu:~# ls -l /dev/dri
total 0
crw-rw---- 1 root video  226,   0 Jun  5 12:34 card0
crw-rw---- 1 root render 226, 128 Jun  5 12:34 renderD128
```

> `/dev/dri/renderD128` had its permissions set to `666` from an earlier attempt to get this working. When passed in the container, the default options are to give the containers `660` access. In the future when trying to do this on a new Proxmox install, this is something to pay attention to.


#### Monitoring from Inside the LXC

Proxmox will restrict performance monitoring tools from being accessed by default. If we want to use a tool like `intel_gpu_top` inside a container, we can tell the kernel to relax these permissions with this command:

```
# By default, my Proxmox installation was set to 4
sysctl kernel.perf_event_paranoid=0
```

This will allow us to use `intel_gpu_top` inside of LXC.

#### Old Notes

```

lxc.cgroup2.devices.allow: c 226:0 rwm
lxc.cgroup2.devices.allow: c 226:128 rwm
lxc.mount.entry: /dev/dri/renderD128 dev/dri/renderD128 none bind,optional,create=file
lxc.mount.entry: /dev/dri dev/dri none bind,optional,create=dir
```

ID mapping that I tried:

```
lxc.idmap: u 0 100000 65536
lxc.idmap: g 0 100000 44
lxc.idmap: g 44 44 1
lxc.idmap: g 45 100045 62
lxc.idmap: g 993 104 1
lxc.idmap: g 994 100107 65427
```

### Install Docker

Ultimately, I'm doing this so that I can install and use Frigate, which recommends installing via Docker. Yes, I'll be running containers in my containers. This is a step up from containers in VMs. Luckily, installing Docker on a Debian LXC is [relatively simple](https://docs.docker.com/engine/install/debian/). 

### Network Shares

Next up is setting up a network share. Since I'm using an Unprivileged LXC, it can't connect to an NFS or CIFS share by itself; we need to setup the share on the Proxmox host and pass the mount through to the container.

#### Mount the Share to Proxmox Host

First, `shutdown` the LXC. On the Proxmox host, make a directory for the mount with `mkdir -p /mnt/lxc_shares/entertainment`. 

Add the following line to `/etc/fstab`:

```
# For NFS: 
192.168.1.211:/mnt/DataStore/entertainment /mnt/lxc_shares/entertainment nfs _netdev,x-systemd.automount,noatime 0 0

# For CIFS (untested)
//192.168.1.211/mnt/DataStore/entertainment /mnt/lxc_shares/entertainment cifs _netdev,x-systemd.automount,noatime,uid=100000,gid=110000,dir_mode=0770,file_mode=0770,user=smb_username,pass=smb_password 0 0
```

Reload the daemon with `systemctl daemon-reload` and mount the share with `mount -a`.

If the mount was successful, open the `.conf` file for the LXC at `/etc/pve/lxc/xxx.conf` and add a new mountpoint to the bottom (ignoring any snapshots that may be present):

```
# /etc/pve/lxc/xxx.conf
mp0: /mnt/lxc_shares/entertainment/,mp=/mnt/nas/entertainment
```

> I tested with the `entertainment` share so that I could test the complete setup with Jellyfin instead of needing to troubleshoot the Frigate configuration while simultaneously troubleshooting the iGPU passthrough and everything else here.

#### Test the Network Share in the LXC

The LXC should startup without issue and we can check the mountpoint by listing the items in the mounted directory: `ls -l /mnt/nas/entertainment`. With everything outputting as expected, we can test the permissions with the following:

```
# Test mount permissions
touch /mnt/nas/entertainment/temp/test.txt
echo "testing" > /mnt/nas/entertainment/temp/test.txt
cat /mnt/nas/entertainment/temp/test.txt
rm /mnt/nas/entertainment/temp/test.txt
```

#### Old Notes 

No ID mapping is required

```
In the LXC:

`groupadd -g 10000 lxc_shares`
`usermod -aG lxc_shares root`
```



### Jellyfin

Since I'm using the Jellyfin image from [LinuxServer](https://www.linuxserver.io/our-images), I needed to follow their [special instructions](https://github.com/linuxserver/docker-jellyfin?tab=readme-ov-file#intel) to get Hardware Acceleration enabled. I'm also using a Jasper Lake iGPU, which also flags this process as being necessary. 

#### Enabling Low-Power Hardware Support

> This only needs to be done on the Proxmox host.

In summary, I added the appropriate packages with `apt update && apt install -y firmware-linux-nonfree`.

Then I enabled `guc`:

```
mkdir -p /etc/modprobe.d
sh -c "echo 'options i915 enable_guc=2' >> /etc/modprobe.d/i915.conf"
```

With this complete, I updated the initramfs and grub with `update-initramfs -u && update-grub` and rebooted the system. 

When the system comes back up, we can check the following commands for FAIL or ERROR in the output:

```
dmesg | grep -E "i915|xe"
sh -c "cat /sys/kernel/debug/dri/0/gt*/uc/guc_info"
sh -c "cat /sys/kernel/debug/dri/0/gt*/uc/huc_info"
```

Assuming all is going according to plan, we can now turn on the LXC and deploy Jellyfin.

#### Deploying Jellyfin with Hardware Acceleration

I used the following `compose.yml`:

```
---
services:
  jellyfin:
    image: lscr.io/linuxserver/jellyfin:10.9.7
    container_name: jellyfin
    group_add:
      - '104'  # This needs to be the group id of running `stat -c '%g' /dev/dri/renderD128` on the docker host
    environment:  
      - PUID=0
      - PGID=0
      - TZ=America/Toronto
      - DOCKER_MODS=linuxserver/mods:jellyfin-opencl-intel
    devices:
      - /dev/dri:/dev/dri
    volumes:
      - ./jellyfin:/config
      - /mnt/nas/entertainment/movies:/data/movies
    ports:
      - 8096:8096
    #   - 8920:8920 #optional
    #   - 7359:7359/udp
    #   - 1900:1900/udp #optional
    restart: unless-stopped
```

1) As mentioned, I'm using the [LinuxServer](https://www.linuxserver.io/our-images) Jellyfin container, so I needed to add `DOCKER_MODS=linuxserver/mods:jellyfin-opencl-intel` to the environment variables.
2) The environment variables `PUID=0` and `PGID=0` are being used to pass root access to the iGPU down from the host to the docker container. This is not the best security decision, but for now it's better than going back over this documentation and adding a new user.
3) `group_add` is found using the command in the comment above, however I think it should also map to the `render` group we mapped forward from the Proxmox host to the LXC.
4) The iGPU is mapped into the container in the `device` section with `/dev/dri:/dev/dri`

#### Jellyfin Settings

Once the Jellyfin server has been deployed, navigate to **Administration** > **Dashboard** and **Playback** > **Transcoding**. Choose *Intel QuickSync (QSV)* for the Hardware acceleration type, and I enabled all types except for `AV1`.

Under *Hardware encoding options*, I checked each of the three options: *Enable hardware encoding*, *Enable Intel Low-Power H.264 hardware encoder*, and *Enable Intel Low-Power HEVC hardware encoder*.

I also selected *Allow encoding in HEVC format* under *Hardware encoding options* and selected **Save** at the bottom of the settings page.

With this done, I played a video and changed the quality to force transcoding. I then confirmed that the transcoding was working by looking at the CPU usage statistics for the LXC in Proxmox Web Ui, as well as used the `intel_gpu_top` tool installed earlier on the Proxmox host.





### To Do

1. Create Unprivileged LXC
1. Install Docker
1. Setup iGPU passthrough
1. Setup Network shares
1. Install Jellyfin
1. Test/troubleshoot HWA

1. Double-check my work
1. Create template with iGPU and Docker
1. Create instructions for easy deployment of new containers









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

### Sources

https://jellyfin.org/docs/general/post-install/transcoding/hardware-acceleration/intel/#linuxserverio-docker
https://jellyfin.org/docs/general/post-install/transcoding/hardware-acceleration/intel/#configure-and-verify-lp-mode-on-linux
https://geekistheway.com/2022/12/23/setting-up-intel-gpu-passthrough-on-proxmox-lxc-containers/
https://www.youtube.com/watch?v=tWumbDlbzLY&t=472s
https://en.wikipedia.org/wiki/Intel_Quick_Sync_Video#Hardware_decoding_and_encoding
https://www.youtube.com/watch?v=0ZDr5h52OOE&t=1158s
https://github.com/blakeblackshear/frigate/discussions/5773

