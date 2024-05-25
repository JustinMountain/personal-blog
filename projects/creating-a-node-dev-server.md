---
title: 'Creating a Next.js Development Server'
featured: 'no'
published: 'no'
updated: 'no'
repo: ''
category: 'documentation'
tags: 'docker, linux, node'
excerpt: 'Developing on a dedicated server can alleviate a lot of problems that come up when dependencies between programs interfere with one another. Even when that dedicated server is running in a virtual machine, the benefits to developing this way far outweigh the hassle of setup.'
excerpt2: ''
thumbnail: 'nextjs-splash.jpg'
thumbnail-alt: ''
---

### Table of Contents

### 🙋🏼 Why Develop in a Virtual Machine?

One of the best uses for virtual machines and containers is being able to leverage isolation of responsibilities. By restricting a development environment to a virtual machine, it won't interfere with any of the processes running on the host machine. It also enables an easy and safe way to rollback destructive changes through snapshots. 

The documentation here outlines how to install a virtual machine and load it with Docker, Git, and Node.js. 

### 🖳 Creating the Virtual Machine

In order to create a virtual machine, first we need to choose an operating system and image. I downloaded [Ubuntu Server 22.04](https://ubuntu.com/download/server) and the proceding explanations use it as the base, but any image should work. I've chosen this image because I'm currently most comfortable with Ubuntu and the server image doesn't include packages like a GUI, which we won't need. 

Create a new virtual machine in a hypervisor (I use [VirtualBox](https://www.virtualbox.org/wiki/Downloads) on my Windows PC and [Proxmox](https://www.proxmox.com/en/downloads) on an old Workstation I got for $80 on Marketplace, but there are other choices).

> During installation, the **TAB** key can help you navigating between menus.

The installation is fairly straight-forward:

1. Select *Ubuntu Server* (it's the default)
2. Make note of the ip address on the **Network connections** page
3. Select the defaults for **Configure proxy** and **Configure Ubuntu archive mirror** pages
4. On **Guided storage configuration** select *Use an entire disk* and de-select *Set up this disk as an LVM group*, if applicable
5. The *Storage configuration* page summarizes the storage and selecting *Done* prompts for confirmation to format the drive.
6. Enter your name, server name (I used `node` ), username (I used `dev`), and a password
7. Skip the upgrade to Ubuntu Pro
8. Select *Install OpenSSH server*
9. Skip the optional snap packages

Ubuntu will take a few minutes to install, and once it's done it will need to be rebooted. After the reboot, there might be a prompt to remove the installation media. If this occurs, find the device tab for the VM and manually remove the Ubuntu install ISO.

### 🐋 Installing Docker

With the installation complete, open PowerShell (or another command line tool) on the host machine and type `ssh <username>@<ip address>` which for me looked like: `ssh dev@198.168.1.140`, then enter your password.

> If you forgot the ip address or didn't write it down, access the VM via the hypervisor and type `ip addr`. The IP address will be here, likely under `ens18`.

Time to install Docker. You can follow the steps on the [docker docs](https://docs.docker.com/engine/install/ubuntu/) or read about [my implementation](/projects/running-docker-in-my-homelab). 

For simplicity, here are the steps to follow:

```
# Update packages, then tab to 'OK' to restart the effected services
sudo apt update && sudo apt upgrade -y

# Add Docker's official GPG key, one line at a time:
sudo apt-get update

sudo apt-get install ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources (copy four lines together):
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update the packages
sudo apt-get update

# Install docker, then tab to 'OK' to restart the effected services
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to the docker group
sudo usermod -aG docker $USER
```

With Docker installed, restart the server with `sudo reboot` then test that everything is working as expected with `docker run hello-world`.

### 🌱 Setup Git

With Docker installed, it's time to install the other essential tool, Git:

```
# Add the git package to the server
sudo apt-get install git
```

Setup a git [username](https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git) and [email](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address) by following the docs or following the simplified version below:

```
# Change to your name on GitHub
git config --global user.name "Justin Mountain"

# Confirm
git config --global user.name

# Change your GitHub associated email (or link your email to GitHub then do this step)
git config --global user.email "YOUR_EMAIL"

# Confirm
git config --global user.email
```

Now that Git has been configured, we need to authenticate the server to make calls to GitHub for us. 

First, we need to [install the gh tool](https://github.com/cli/cli/blob/trunk/docs/install_linux.md). At the link, copy the entire block of code under **Official Sources** > **Debian, Ubuntu Linux, Raspberry Pi OS (apt)** > **Install**.

```
# Update the repos
sudo apt update

# Install the gh tool
sudo apt install gh
```

In a web browser, go to the [token generation page on GitHub](https://github.com/settings/tokens?type=beta) and generate a new token. Give this token a name ( I used `course-project`) and set its expiration to 90 days.

Under **Repository access** choose **Only select repositories** and the appropriate repo.

Under **Permissions** > **Repository permissions** and give full permissions (**Access: Read and write** or **Access: Read-only** as applicable). 

I left **Permissions** > **Account permissions** untouched.

Click 'Generate Token' and copy it. DO NOT LOSE IT.

Switch back to the SSH connection to the server and enter `gh auth login`. Follow the instructions on screen, selecting *GitHub.com*, then *HTTPS*, the *Paste an authentication token*, then *Y*, and finally paste the authentication token copied from GitHub.com above. If you lost the token you will need to generate a new one. 

#### 🪞 Clone the Repo

In the GitHub repo you want to clone, click the large button that says '<> Code' and copy the HTTPS link to the repo.

Back in the SSH connection:

```
# Clone the repo
git clone <HTTPS Link to the repo>

# Enter the cloned directory
cd <repo name>
```

### 🖹 Running Code-Server

We'll use a containerized version of VS Code to simplify access to the code. It runs exactly like the standalone app. There is a `code-server` directory at the root of the repo, which contains the following docker-compose.yaml file:

```
version: "2.1"
services:
  code-server:
    image: lscr.io/linuxserver/code-server:latest
    container_name: code-server
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Toronto
      - DEFAULT_WORKSPACE=/business-park-app
    volumes:
      - ./config:/config
      - ../:/business-park-app
    ports:
      - 8443:8443
    restart: unless-stopped
```

This file declares the configurations for the container. The last line tells the container to always restart, which should make it persistent between VM restarts as well. To run the code-server container:

```
# From the project's root directory:
cd code-server/

# Start the container
docker compose up -d
```

This will run the container in detatched mode. We won't see the containers log files, but it also won't interfere with our console.  

The entire project should now be available in a web browser at `<ip address>:8443`.

### 📢 Installing Node.js

> This is out of date... need to update

The repo has been cloned, but the project won't run until we install Node.js and the project's dependencies on the system. 

```
# snapd allows another set of packages to be installed
sudo apt install snapd

# Install node
sudo snap install node --classic

# Navigate to the directory that contains the Next.js app:
cd ~/Hub350-Business-Park-Map/business-park-map/

# Install all of the missing dependencies
npm ci
```

Throughout the project, we may add new dependencies. Running `npm ci` again should find and download any missing dependencies from your VM. 

Finally, everything is installed and ready to go. Run the development server with `npm run dev`, open a web browser and access the running project at `<ip address>:3000`. You should see the project in the web browser.

With this all setup and working, it's a good time to shut down the virtual machine and **take a snapshot**. Doing so will allow you to rollback to this state and act as protection for potentially bad scenarios. 

### 📈 Project Workflow

With all of this setup complete, the development workflow should look something like this:

1. Start the VM
2. SSH into the server
3. Navigate to the app directory `cd ~/Hub350-Business-Park-Map/business-park-map/`
4. Run the development server with `npm run dev`.
5. See the live running at `<ip address>:3000`
6. Access the files at `<ip address>:8443`

Any changes made to the file at `app/page.js` should appear immediately in the browser. Feel free to play around with the code, test different Tailwind CSS tags, or add components to the page. Just don't forget to `git restore .` from the project directory before pulling updated code from GitHub.

Throughout development, the following commands might be useful for testing different aspects of the code or deployment of the application:

```
# Run in development mode
npm run dev

# Build the project
npm run build

# Start the server for production
npm run start
```
