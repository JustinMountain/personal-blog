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


ansible-playbook -i ./ansible/inventory/hosts ./ansible/setup-uptime-kuma.yml --ask-vault-pass






### Intro

As we [learned before](), Ansible Roles are collections of various tasks, variables, files, templates, and handlers and what makes them extra powerful is the ability to share them via [Ansible Galaxy](https://galaxy.ansible.com/ui/). Through this Ansible community, we can leverage some of the awesome work that others have done to automate more complicated and repetitive tasks. One such tasks is installing Docker. 

I'll be using Jeff Geerling's [Ansible Role for Docker](https://galaxy.ansible.com/ui/standalone/roles/geerlingguy/docker/install/). Writing my own Role for this would be a great learning exercise, however I think leveraging Jeff's Role and ([textbook](https://www.ansiblefordevops.com/)) to push forward with learning more of Ansible and coming back to writing my own Role later makes more sense. Jeff seems to be the *go to* Ansible guy and the Docker Role had been updated 2 hours before I discovered it, so it seems like he statys on top of this highly recommended Role. 

I started by installing the Role with `ansible-galaxy` on my control node: 

```
ansible-galaxy role install geerlingguy.docker
```

Once the Role had been installed, I created a playbook called `docker-geerling.yml` to utilize it:

```
---
- name: Install Docker using Jeff Geerling's Ansible Role
  hosts: "*"
  become: yes
  vars_files:
    - ~/.ansible/vault/ansible_become_pass.yml
  roles:
    - geerlingguy.docker
```

Now all we have to do is run the `docker-geerling.yml` playbook and Docker will be installed on the target servers.










Start with creating two server groups, one for common things like setup and another for docker stuff

Talk about the Jeff Geerling role and Ansible Galaxy

Stand up a dashboard, uptime kuma, and open webui

Stand them up on an admin VM separate from sandbox, adjust inventory file accordingly

Standup a Services VM 

Figure out how to handle checking for, pulling, and updating from new containers, deleting old ones

### Next

2) Pick a docker image for automatic deployment
 - Docker image updates
I need to look at templates and copying files/directories 
 - TechnoTim example is using timesyncd config @13:10 https://www.youtube.com/watch?v=w9eCU4bGgjQ
 - Setting up an ftp server for jellyfin connection might be something worth exploring here
   - I think I might be able to setup a mountpoint in proxmox and pass it to the VM?
 - I want to do it with pi-hole blocklist 
 - Ultimately it would be ideal to use this to spin up new containers with existing settings without requiring a backup of the VM, just the mounted directories inside containers



### To Do





```
- name: Deploy Docker stack
  community.docker.docker_compose_v2:
    project_name: my_project
    project_src: /path/to/docker-compose.yml
    state: present

```


Need to consider cleaning up volumes/images and a separate playbook to take down
