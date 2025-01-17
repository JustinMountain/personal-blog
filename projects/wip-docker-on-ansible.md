---
title: 'Docker on Ansible'
featured: 'no'
published: 'no'
updated: ''
repo: ''
category: ''
tags: ''
excerpt: ''
excerpt2: ''
thumbnail: ''
thumbnail-alt: ''
---

### Table of Contents

### Intro

As we [learned before](https://justinmountain.com/projects/running-ansible-in-my-homelab), Ansible Roles are collections of various tasks, variables, files, templates, and handlers that can be applied to different playbooks. Through [Ansible Galaxy](https://galaxy.ansible.com/ui/), we can leverage some of the awesome work that others have done to automate more complicated and repetitive tasks. 

One such tasks is installing Docker. I'll be using Jeff Geerling's [Ansible Role for Docker](https://galaxy.ansible.com/ui/standalone/roles/geerlingguy/docker/install/). Writing my own Role for this would be a great learning exercise, however I think leveraging Jeff's Role and ([textbook](https://www.ansiblefordevops.com/)) to push forward with learning more of Ansible and coming back to writing my own Role later makes more sense. Jeff seems to be the *go to* Ansible guy and the Docker Role had been updated 2 hours before I discovered it, so it seems like he stays on top of this highly recommended Role. 

### Installing `geerlingguy.docker`

I started by installing the Role with `ansible-galaxy` on my control node: 

```
ansible-galaxy role install geerlingguy.docker
```

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

Now all we have to do is run the `docker-geerling.yml` playbook and Docker will be installed on the target servers. 

### Creating an Initialization Playbook

While a playbook for a role like this is completely possible, I have included it in an Ubuntu server initialization playbook:

```
---
- name: Init server from fresh Ubuntu install
  hosts: "server_setup_proxmox"
  vars_files:
  - ~/.ansible/vault/ansible_ssh_pass.yml
  - ~/.ansible/vault/ansible_become_pass.yml
  roles:
    - role: init/ssh_key_copy
    
    - role: init/disable_password_login
      become: yes

    - role: init/apt_update_upgrade
      become: yes

    - role: init/qemu_guest_agent
      become: yes

    - role: geerlingguy.docker
      become: yes

    - role: init/network_config
      become: yes
```

This playbook handles all the necessary tasks that I do for every server I spin up and the other roles can be found in my [Homelab repo](https://github.com/JustinMountain/homelab/tree/main/ansible/roles/init). 

### Automating Docker Compose

Since I'm using Ansible to manage remote servers, it's a pain in the ass to make a change, ssh into the machine, copy the files, and run the appropriate commands. This is why I made `compose_up` and `compose_down` roles that take care of all that for me. 

The role handles everything so that I can just worry about writing a new `compose.yml` file and run it to make sure that everything is taken care of. It ensure the right directories are present on remote, handles moving over the `compose.yml` and `.env` files as well as any extra files that may be needed (I use a `/`data`` subdirectory), and even create the `proxy` docker network so that I can easily hook up new services into my [Traefik]() configuration. 

`docker compose down` is a much simpler role, as it just needs to worry about tearing down the stack. However, with the roles created they are used in functionally the same way: Add the name of the container stack and go. 

### Where do I go from here?

clean up images
volume and directory backup
other cleanup activities
