---
title: 'Running Ansible in My Homelab'
featured: 'no'
published: 'no'
updated: 'no'
repo: 'https://github.com/JustinMountain/docker-compose'
category: 'repository'
tags: 'linux, homelab, ansible'
excerpt:  ""
excerpt2: ""
thumbnail: ""
thumbalt: ""
---

### Table of Contents

### Installing Ansible

```
sudo apt update && sudo apt upgrade -y
```



```
# Check if pip/python is installed
python3 -m pip -V

# Install if not
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py --user

# Install Ansible
python3 -m pip install --user ansible

# Upgrade the Ansible installation 
python3 -m pip install --upgrade --user ansible
```

### Setting Up An Inventory

```
# Create an ansible directory
mkdir ./ansible 

# Create an inventory directory
mkdir ./ansible/inventory 

# Create a hosts file for the inventory
touch ./ansible/inventory/hosts
```

The hosts file has group names like `[group-name]` followed by a list of IP addresses or dns names for the servers:

```
# Content of hosts file for demonstration
[test_server]
192.168.1.229
```

We can test the hosts file by using the sshpass package on the ansible control node:

```
# Install the sshpass package
sudo apt install sshpass

# Test the hosts file on the test-server group above
ansible -i ./ansible/inventory/hosts test_server -m ping --user justin --ask-pass
```

[![Ping Pong](ansible-ping-pong.jpg "A successful ansible ping pong response")](ansible-ping-pong.jpg)
*A successful ansible ping pong response*

### Automating Key-Based Authentication

Ansible is at its best when it's used to automate tasks, so let's create an SSH key and an Ansible playbook to copy the key over:

```
# Create SSH key for Ansible
ssh-keygen -t ed25519 -C "ansible"

# Create a directory to save the SSH keys
# Enter Password (or blank)
/home/justin/.ssh/ansible
```

Now we need to create a playbook to copy the ansible key to the taget host, wait for ssh to become available, then ping the host to ensure that key-based authentication has been set up.

```
# Create a playbook directory
mkdir ./ansible/playbooks 
```

After the playbook directory has been created, create a file called `ssh-key-setup.yaml` with the following content:

```
---
- name: Copy SSH key and verify connectivity
  hosts: test_server
  tasks:
    - name: Copy SSH key to target hosts
      command: ssh-copy-id -i ~/.ssh/ansible.pub {{ inventory_hostname }}
      delegate_to: localhost
      ignore_errors: yes

    - name: Wait for SSH to be available
      wait_for:
        host: "{{ inventory_hostname }}"
        port: 22
        timeout: 60
        state: started

    - name: Ping test group hosts
      ansible.builtin.command:
        cmd: ansible {{ inventory_hostname }} -m ping --key-file ~/.ssh/ansible
      delegate_to: localhost
      ignore_errors: yes
```

Now all that's left is running the following command:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/ssh-key-setup.yaml --private-key ~/.ssh/ansible
```

This command tells Ansible to use the specific inventory to run the playbook found in `ssh-key-setup.yaml` using the ansible private key. 

[![Running a playbook to copy over a public key](ansible-ssh-setup-playbook.jpg "Running a playbook to copy over a public key")](ansible-ssh-setup-playbook.jpg)
*Running a playbook to copy over a public key*

The "Copy SSH key to target hosts" task indicates that the key was copied over to the target with the `changed` tag.

Similarly, the "Ping test group hosts" task is also indicated with the `changed` tag because the ping was successfully ponged.

It's worth noting that the authentication key can be copied over manually with the following command:

```
# Copy the public key to a target server
ssh-copy-id -i ~/.ssh/ansible.pub 192.168.1.229
```

The ping module can also be called ad-hoc using the following once the key is present on the server:

```
# Use Ansible ping module to check condition
ansible all -m ping --key-file ~/.ssh/ansible
```

#### Adding another SSH key for non-Ansible related tasks

#### Disabling Non-Key Access

This would be good for extra security.


### Using Ansible Vault to Store Passwords

Some actions, like updating `apt` require a sudo password. It's fun to type one out for each server in the inventory file, nor is it a good idea to store them in plain text. We can create a variable to store the password and encrypt that file for ansible to use:

```
# Create the file to store the sudo password
echo 'ansible_become_password: secure_password' > ~/.ansible/vault/ansible_become_pass.yml

# Encrypt the file with ansible-vault
ansible-vault encrypt ~/.ansible/vault/ansible_become_pass.yml
```

You will be prompted to enter a password for the vaulted varibale. You can check that the password has been successfully encrypted as well:

```
cat ~/.ansible/vault/ansible_become_pass.yml
```

Let's create a file called `apt-update-upgrade.yaml` to complete the example started at the top of this section: 

```
---
- name: apt update && upgrade
  hosts: test_server
  become: yes
  vars_files:
    - ~/.ansible/vault/ansible_become_pass.yml
  tasks:
    - name: apt
      apt: 
        update_cache: yes
        upgrade: 'yes'
```


Finally we can run the playbook to update our test server with the following command:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/apt-update-upgrade.yaml --private-key ~/.ssh/ansible --ask-vault-pass
```


### Next Section

Install Docker?
Can I make a playbook of playbooks to initiate a server from scratch?

I need to look at templates and copying files/directories 
 - TechnoTim example is using timesyncd config @13:10 https://www.youtube.com/watch?v=w9eCU4bGgjQ
 - Setting up an ftp server for jellyfin connection might be something worth exploring here
 - I want to do it with pi-hole blocklist 
 - Ultimately it would be ideal to use this to spin up new containers with existing settings without requiring a backup of the VM, just the mounted directories inside containers



