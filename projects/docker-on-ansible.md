---
title: 'Deploying Docker with Ansible'
featured: 'no'
published: '2024-09-02'
updated: '2025-02-11'
repo: 'https://github.com/JustinMountain/homelab/tree/main/ansible/roles/docker'
category: 'repository'
tags: 'docker, linux, homelab, ansible, IaC'
excerpt: 'I wrote some Ansible roles to deploy Docker containers to virtual machines in my home network.'
excerpt2: ''
thumbnail: 'docker-on-ansible.jpg'
thumbnail-alt: 'Deploying Docker containers using Ansible'
---

### Table of Contents

### 🐋 Why Automate Docker?

Installing Docker is something I do to most of the VMs that I spin up, so it made sense to automate this with Ansible as well. While looking into it I found [Ansible Galaxy](https://galaxy.ansible.com/ui/), a public repository for community-made roles. 

I know that writing my own Role for this would be a great learning exercise, but I found Jeff Geerling's [Ansible Role for Docker](https://galaxy.ansible.com/ui/standalone/roles/geerlingguy/docker/install/) on Ansible Galaxy and decided there was probably no better role to trust. Jeff seems to be the *go to* Ansible guy and the Docker Role had been updated 2 hours before I discovered it, so it seems like he stays on top of this highly recommended Role. The learning exercise is implementing a community role into my workflow, and any energy spent on re-inventing the wheel can be better spent fixing a more bespoke problem.

### 🌌 Installing `geerlingguy.docker`

I started by installing the Role with `ansible-galaxy` on my control node with `ansible-galaxy role install geerlingguy.docker`.

Once the Role had been installed, I created a playbook called `docker-geerling.yml` to utilize it:

```
---
- name: Install Docker using Jeff Geerling's Ansible Role
  hosts: "target"
  become: yes
  vars_files:
    - ~/.ansible/vault/ansible_become_pass.yml
  roles:
    - role: geerlingguy.docker
      become: yes
```

> When copying this playbook, it's important to remember to change the `hosts` declaration or file before running it. 

Now all I had to do was run the `docker-geerling.yml` playbook and Docker would be installed on the target servers. 

Once I confirmed that the playbook ran as expected, I added the `geerlingguy.docker` role to my existing initialization playbook instead of keeping a dedicated playbook just for this task.

### 🔂 Automating Docker Compose

Now that I could install Docker onto remote servers with Ansible, I wanted to use Ansible to deploy containers. I already use `compose.yml` files with Docker, so the deployment is written declaratively and it seemed like a logical next-step and worthy of the aforementioned bespoke problem. 

Documentation really came in handy, because in order to successfully run `docker compose up -d` on the remote server there are a number of prerequisites and things to consider. Some deployments require `.env` files and others require additional files. I've standardized this into `compose.yml` and `.env` in the root directory, and any additional files will be inside a `/data` directory. 

I had documention already written which outlined what needs to be done to deploy a new service, so I used this as the foundation for my role. I followed a relatively simple check *does required thing exist?* then acting accordingly. The `compose_up` role has quite a few more checks than `compose_down` requires, as in addition to the file checking described above, it also has some built-in checks to work with my Traefik deployment, but they both following the simple check-act gameplan.

#### ✍️ In Practice

After creating a `compose.yml` file for a new service, all I need to do is create a simple playbook:

```
---
- name: Deploy the SERVICE stack of Docker containers
  hosts: "services"
  become: yes
  vars_files:
  - ~/.ansible/vault/ansible_become_pass.yml
  roles:
  - role: docker/compose_up
    vars:
      stack_name: "service"
```

With the playbook created, simply running `ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/services/up_jellyfin.yml --ask-vault-pass` from the root on my `homelab` repository will deploy the `compose.yml` file to the declared remote host.

The roles can, of course, also be added to other playbooks.

### 🫣 What's Next?

I'm not sure if this is the *right* way to deploy docker to remote servers, but it works. I will continue to use this as my solution and continue to learn more.

The next role that I want to write is one to cleanup old images on the remote hosts. Currently, I have the version tags as variables and keep them in my `.env` file. It would be nice to be able to roll my updates, then run a playbook that cleans up all of the old images. 

Since all of my containers are using mapped directories, it might also be helpful to write a role that backs up the home directory. In the past I've been saved when needing to restore a container deployment by having access to the home directory. Even though I have bolstered my backup strategy, I think that automating a backup of these files would be an extra option if restoration ever became required.

Not an Ansible role to interact with my Docker deployments necessarily, but I would like to explore a GitOps workflow that allowed me to make changes or adjustments to my Docker deployments which then would run the playbooks on commit. I think I can do this self-hosted with GitLab...
