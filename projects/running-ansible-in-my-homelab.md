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

The `--user justin --ask-pass` flags on this refer to this user and password for the ansible control node, as the playbook uses the `ssh-copy-id` command from the control node. 

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

After the playbook directory has been created, create a file called `ssh-key-setup.yml` with the following content:

```
---
- name: Copy SSH key and verify connectivity
  hosts: "*"
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
ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/ssh-key-setup.yml --user justin --ask-pass
```

This will copy over the public SSH key to the server, and subsequent SSH requests can use the flag `--private-key ~/.ssh/ansible`. For example, the following command will run the same playbook using the SSH key instead:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/ssh-key-setup.yml --private-key ~/.ssh/ansible
```

This command tells Ansible to use the specific inventory to run the playbook found in `ssh-key-setup.yml` using the ansible private key. 

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


### Using Variables

#### In the `hosts` file

It's possible to streamline the use of variables by including them in the hosts file. For example, adding the Ansible Host's username can be done by adding the following to the top of the `hosts` file: 

```
[all:vars]
ansible_user=justin
```

When each of the servers in the inventory will have a different `ansible_user`, it's possible to declare the variable per-server:

```
[test_server]
192.168.1.229 ansible_user=justin
```


#### Using Ansible Vault to Store Passwords

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

Let's create a file called `apt-update-upgrade.yml` to complete the example started at the top of this section: 

```
---
- name: Update and upgrade apt repository
  hosts: "*"
  become: yes
  vars_files:
    - ~/.ansible/vault/ansible_become_pass.yml
  tasks:
    - name: Run apt update && upgrade
      apt: 
        update_cache: yes
        upgrade: 'yes'
```


Finally we can run the playbook to update our test server with the following command:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/apt-update-upgrade.yml --private-key ~/.ssh/ansible --ask-vault-pass
```

### Using Conditions

#### On File Existence

Sometimes when we run the `apt update && upgrade` commands, we need to restart the kernel. Luckily, Ansible allows us to create conditions and we can leverage this to tell our playbook to restart the target machine if a reboot is necessary by adding the following as tasks two and three to the `apt-update-upgrade.yml` file: 

```
- name: Check if reboot is required
  register: reboot_required_file
  stat: path=/var/run/reboot-required get_md5=no

- name: Reboot if necessary
  reboot:
    msg: "Reboot initiated by Ansible for kernel updates"
    connect_timeout: 5
    reboot_timeout: 300
    pre_reboot_delay: 30
    post_reboot_delay: 30
    test_command: uptime
  when: reboot_required_file.stat.exists

```

Task two, "Check if reboot is required," creates variable, `reboot_required_file`, which contains information about the file found at the remote target path `/var/run/reboot-required`. Task three, using the clause `when: reboot_required_file.stat.exists` simply checks if a file exists at the specified path. 

The completed `apt-update-upgrade.yml` file now runs the update and upgrade commands, checks if a restart is required, and follows through with an update if necessary. 

[![Conditions in action](ansible-conditions.jpg "Conditions in action")](ansible-conditions.jpg)
*Conditions in action*

#### On File Contents

When can also create conditions to check the contents of files. We can leverage this in our situation by modify `ssh-key-setup.yml` to check if our Ansible SSH key present on the target before copying it over.

To do so, first we need to add the following two tasks as the first and second tasks in `ssh-key-setup.yml`:

```
- name: Read the contents of the authorized_keys file
  slurp:
    path: ~/.ssh/authorized_keys
  register: authorized_keys_contents

- name: Decode the authorized_keys contents
  set_fact:
    authorized_keys_decoded: "{{ authorized_keys_contents.content | b64decode }}"
```

Here, the first tasks takes the contents of the target's authorized_keys file and the second decodes the base64-encoded content of this file.

Now we can use the `authorized_keys_decoded` variable to create `when` conditions in our playbook. By adding the `when: "'ansible' not in authorized_keys_decoded"` clause to the end of each of the three original tasks in `ssh-key-setup.yml` (now tasks 3-5). Running this playbook now will first check the contents of the target's `authorized_keys` file and then only copy the ansible public key from the control node to the target only if it is not already present.

**Picture of the completed file?**

#### Introduction to Idempotency

Up to now, we have been using Ansible to make actions (or not) depending on the existence/contents of a file. Through Ansible, we can leverage idempotency, which I like to think of as declarative state. With idempotency, we can not only have Ansible follow through with conditional actions, but we can tell Ansible what we want the desired state of our server to be. In other words, we can tell Ansible that we want a certain package to be present and Ansible will only act if necessary. 

On my Proxmox virtual machines, I like to make sure the the QEMU Guest Agent package is installed, so I have a playbook called `qemu-guest-agent.yml` to manage exactly that:

```
---
- name: Install latest qemu-guest-agent 
  hosts: "*"
  become: true
  vars_files:
    - ~/.ansible/vault/ansible_become_pass.yml
  tasks: 
    - name: install qemu-guest-agent
      apt:
        name: qemu-guest-agent
        state: present
        update_cache: true
```

The most important line here is `state: present`. This instructs Ansible to make sure that the latest qemu-guest-agent package is installed. When we run this playbook for the first time, it will install the package and result in a 'changed' status and subsequent runs will result in the 'ok' status since the state is present as declared. 

[![Idempotency in action](ansible-idempotency.jpg "Idempotency in action")](ansible-idempotency.jpg)
*Idempotency in action*

### Other Niceities

#### Ansible Roles

Ansible Roles are collections of various tasks, variables, files, templates, and handlers which can be shared via [Ansible Galaxy](https://galaxy.ansible.com/ui/). Through this Ansible community, we can leverage some of the awesome work that others have done to automate more complicated and repetitive tasks. One such tasks is installing Docker. 

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


#### Adding another SSH key for non-Ansible related tasks

I need to be able to add SSH keys for other devices so that I can SSH into these servers without ansible

#### Disabling Non-Key Access

Once above point is taken care of, this would be good for extra security.





### Setting Up a New Server

To setup a new server, first add the server to the hosts file:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/ssh-key-setup.yml --ask-pass

ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/apt-update-upgrade.yml --private-key ~/.ssh/ansible --ask-vault-pass

ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/qemu-guest-agent.yml --private-key ~/.ssh/ansible --ask-vault-pass

ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/docker-geerling.yml --private-key ~/.ssh/ansible --ask-vault-pass

```

### Next Section

Can I make a playbook of playbooks to initiate a server from scratch?
 - is this what a Role is?

I need to look at templates and copying files/directories 
 - TechnoTim example is using timesyncd config @13:10 https://www.youtube.com/watch?v=w9eCU4bGgjQ
 - Setting up an ftp server for jellyfin connection might be something worth exploring here
   - I think I might be able to setup a mountpoint in proxmox and pass it to the VM?
 - I want to do it with pi-hole blocklist 
 - Ultimately it would be ideal to use this to spin up new containers with existing settings without requiring a backup of the VM, just the mounted directories inside containers
