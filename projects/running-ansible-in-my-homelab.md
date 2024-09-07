---
title: 'Running Ansible in My Homelab'
featured: 'no'
published: '2024-06-15'
updated: '2024-09-07'
repo: 'https://github.com/JustinMountain/homelab/ansible'
category: 'repository'
tags: 'linux, homelab, ansible, IaC'
excerpt:  "Ansible allows me to establish my homelab's Infrastructure as Code. Through Ansible, I declare the desired state of my server(s) and Ansible does the rest."
excerpt2: ""
thumbnail: "ansible-splash.jpg"
thumbalt: "Ansible logo"
---

### Table of Contents

### 🅰️ Installing Ansible

> This was written using WSL as the Ansible control node and being executed on an Ubuntu 22.04 VM inside of Proxmox.

Just like any good command-line session, this one starts with `sudo apt update && sudo apt upgrade`.

Ansible needs to be installed before it can be used, and it requires Python/pip:

```
# Check if pip/python is installed
python3 -m pip -V

# If not, install it
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py --user
```

There's a similar pair of commands to install and upgrade Ansible onto the system:

```
# Install Ansible
python3 -m pip install --user ansible

# Upgrade the Ansible installation 
python3 -m pip install --upgrade --user ansible
```

### 📋 Setting Up An Inventory

Ansible uses inventory files to track the servers that it should manage. I did this through a `hosts` file:

```
# Create an ansible directory
mkdir ./ansible 

# Create an inventory directory
mkdir ./ansible/inventory 

# Create a hosts file for the inventory
touch ./ansible/inventory/hosts
```

Hosts files uses group names like `[group-name]` followed by a list of IP addresses or dns names for the servers that are configured within the group. Within this `hosts` file, it's also possible to add variables for individual servers. Here we have `ansible_user`, which is the remote user that will be used to execute tasks:

```
# Content of hosts file for demonstration
[sandbox]
192.168.1.229 ansible_user=justin
```

It's possible to test the `hosts` file using the `sshpass` package on the ansible control node:

```
# Install the sshpass package
sudo apt install sshpass

# Test the hosts file on the sandbox group above
ansible -i ./ansible/inventory/hosts sandbox -m ping --user justin --ask-pass
```

> The `--user justin` and `--ask-pass` flags on this refer to this user and password for the ansible control node, as the playbook uses the `ssh-copy-id` command from the control node. These are unneccesary if they are included in-line as described above or injected in other ways, which can be found below.

[![Ping Pong](ansible-ping-pong.jpg "A successful ansible ping pong response")](ansible-ping-pong.jpg)
*A successful ansible ping pong response*

### 🗝️ Automating Key-Based Authentication

Ansible is at its best when it's used to automate tasks, and an SSH key will allow us to do so more securely:

```
# Create an SSH key for Ansible
ssh-keygen -t ed25519 -C "ansible"

# Create a directory to save the SSH keys
/home/wsl/.ssh/ansible

# Enter Password (or blank)
# Leaving it blank allows for easier integration with automations but comes with a non-zero cost for security
```

It's possible to automate the addition of SSH keys to remote servers in our `hosts` file via a playbook:

```
# Create a playbook directory
mkdir ./ansible/playbooks 
```

With the playbook directory created, I created a file called `ssh-key-setup.yml` with the following content:

```
---
- name: Copy SSH key and verify connectivity
  hosts: "*"
  tasks:
    - name: Copy Ansible SSH key to target hosts
      command: ssh-copy-id -i ~/.ssh/ansible.pub {{ ansible_user }}@{{ inventory_hostname }}
      delegate_to: localhost
      ignore_errors: yes

    - name: Wait for SSH to be available
      wait_for:
        host: "{{ inventory_hostname }}"
        port: 22
        timeout: 60
        state: started

    - name: Ping sandbox group hosts
      ansible.builtin.command:
        cmd: ansible {{ inventory_hostname }} -m ping --key-file ~/.ssh/ansible
      delegate_to: localhost
      ignore_errors: yes
```

This playbook contains three separate tasks that will be run on all of the servers in the `hosts` file. This short playbook illustrates a lot of the power of Ansible while also being fairly easy to read and understand. The first task, as the name implies, copies the SSH from the control node (`delegate_to: localhost` means that the task itself should be run on the control node). Ansible variables look like `{{ inventory_hostname }}` and since Ansible will loop over all of the servers in the `hosts` file, this one is used as a placeholder for the current iteration of that loop. The second and third tasks wait for the SSH service to be available, then test the SSH key with ping using the key.

Running the following command will run the playbook using the `hosts` inventory file:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/ssh-key-setup.yml --ask-pass
```

Subsequent SSH requests can use the flag `--private-key ~/.ssh/ansible` instead of asking for the remote password. For example, the following command will run the same playbook using the SSH key instead:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/ssh-key-setup.yml --private-key ~/.ssh/ansible
```

[![Running a playbook to copy over a public key](ansible-ssh-setup-playbook.jpg "Running a playbook to copy over a public key")](ansible-ssh-setup-playbook.jpg)
*Running a playbook to copy over a public key*

The "Copy SSH key to target hosts" task indicates that the key was copied over to the target with the `changed` tag.

Similarly, the "Ping sandbox group hosts" task is also indicated with the `changed` tag because the ping was successfully ponged.

It's worth noting that the authentication key can be copied over manually with the following command:

```
# Copy the public key to a target server
ssh-copy-id -i ~/.ssh/ansible.pub justin@192.168.1.229
```

The ping module can also be called ad-hoc using the following once the key is present on the server:

```
# Use Ansible ping module to check condition
ansible all -m ping --key-file ~/.ssh/ansible
```

#### ⛔ Disabling Non-Key Access

Now that I can administer remote servers via SSH keys, it's a good idea to disable simple username/password authentication and require the use of one of these keys for access. This is a security feature to help protect against SSH brute-force attacks, so while it's not necessary for internal servers I think it's good practice.

On my server, as of Ubuntu 22.04, there are multiple config files that control password authenication. One is found at `/etc/ssh/sshd_config` and another at `/etc/ssh/sshd_config.d/50-cloud-init.conf`.

For the file at `/etc/ssh/sshd_config`, I created a task that check if the file exists and another that uses a regex replacement to turn off password authentication: 

```
- name: Ensure sshd_config exists
  stat:
    path: /etc/ssh/sshd_config
  register: sshd_config

- name: Disable password authentication in sshd_config
  lineinfile:
    path: /etc/ssh/sshd_config
    regexp: '^#?PasswordAuthentication'
    line: 'PasswordAuthentication no'
    state: present
  when: sshd_config.stat.exists
```

While researching how to disable password authentication with Ansible, I found that there can be multiple files within the `etc/ssh/sshd_config.d/` directory, so we'll have a third task that uses pattern matching to identify all files within the directory and a fourth that loops over found files and performs the above regex replacement if necessary:

```
- name: Find SSH configuration files
  find:
    paths: /etc/ssh/sshd_config.d
    patterns: '*.conf'
  register: sshd_config_files

- name: Disable password authentication in sshd_config.d files
  lineinfile:
    path: "{{ item.path }}"
    regexp: '^#?PasswordAuthentication'
    line: 'PasswordAuthentication no'
    state: present
  loop: "{{ sshd_config_files.files }}"
  when: sshd_config_files.matched > 0
```

A fifth and final task is required to restart the SSH service to ensure that our changes can take effect:

```
- name: Restart SSH service
  service:
    name: sshd
    state: restarted
  when: sshd_config.stat.exists
```

The playbook containing these tasks can then be run with the following command:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/disable-password-login.yml --private-key ~/.ssh/ansible
```

With the playbook executed, SSH keys are now required to access the remote server!

#### 🔐 Adding Another SSH key for non-Ansible Related Tasks

This Ansible documentation has been written from the perspective of a dedicated Linux Ansible control node and sometimes I might want to access these remote servers via SSH without using Ansible or from an entirely different computer.

I used WSL to create a second SSH key to be used remote connections from my Windows desktop:

```
# Log into WSL and create SSH key for admin tasks
ssh-keygen -t ed25519 -C "admin"

# Create a directory to save the SSH keys
/home/wsl/.ssh/admin

# Enter Password (or blank)
# Blank allows Ansible to use this key with password prompt at start for vault only
```

With the key created, I needed to make sure that it had been added to the agent and could be used:

```
# Check the list of ssh keys
ssh-add -l

# Ensure the agent is running
eval $(ssh-agent)

# Add the admin key if not present in the list
ssh-add ~/.ssh/admin
```

With the SSH key created and active, next I need to create a task to copy it to remote servers. In `ssh-key-setup.yml`, I added the following task:

```
- name: Copy admin SSH key to target hosts
  command: ssh-copy-id -i ~/.ssh/admin.pub {{ ansible_user }}@{{ inventory_hostname }}
  delegate_to: localhost
  ignore_errors: yes
  when: "'admin' not in authorized_keys_decoded"
```

In the case where you want to use Ansible to distribute a key from a machine that isn't the control node, the `-f` flag will be required.

I had this situation come up when I wanted to use a key from my Windows machine so that I could use VSCode's remote connection to the server for development, but it would also be useful for enabling SSH access to trusted devices. 

To add a key like this for VSCode, I modifed the ssh config file in `./ssh` by adding a block for each remote server:

```
# Template
Host [alias]
  HostName [address]
  User [user]
  IdentityFile [seckey key location]

# Example
Host Sandbox
  HostName 192.168.1.229
  User justin
  IdentityFile C:\Users\Justin\.ssh\admin
```

### 🗶 Using Variables

#### #️⃣ In the `hosts` file

It's possible to streamline the use of variables by including them in the hosts file. For example, adding the Ansible Host's username can be done by adding the following to the top of the `hosts` file if all servers will use the same `ansible_user`: 

```
[all:vars]
ansible_user=justin
```

When each of the servers in the inventory will have a different `ansible_user`, it's possible to declare the variable per-server (as we've already seen):

```
[sandbox]
192.168.1.229 ansible_user=justin
```

> It's also possible to place tasks in playbooks and roles, and it is up to us as administrators to decide the best place to put a particular variable.

### 🔒 Using Ansible Vault to Store Passwords

Some actions, like updating `apt` require a sudo password. It's not fun to type one out for each server in the inventory file, nor is it a good idea to store them in plain text. To this end, I created a variable to store the password and encrypted that file for Ansible to use:

```
mkdir ~/.ansible/vault
touch ~/.ansible/vault/ansible_become_pass.yml

# Create the file to store the sudo password
echo 'ansible_become_password: secure_password' > ~/.ansible/vault/ansible_become_pass.yml

# Encrypt the file with ansible-vault
ansible-vault encrypt ~/.ansible/vault/ansible_become_pass.yml
```

Whenever I want to use the vaulted variable, I am now prompted for the password I used to encrypt it. It's possible to check that the password has been successfully encrypted as well:

```
cat ~/.ansible/vault/ansible_become_pass.yml
```

Next, I created a playbook called `apt-update-upgrade.yml` to complete the example started at the top of this section: 

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

Finally I could run the playbook to update my sandbox server with the following command:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/playbooks/apt-update-upgrade.yml --private-key ~/.ssh/ansible --ask-vault-pass
```

#### 🙈 Encrypting a Standardized SSH Password 

In cases where a standardized password is used for the initial user, we can use Ansible Vault to store an encrypted version:

```
touch ~/.ansible/vault/ansible_ssh_pass.yml

# Create the file to store the sudo password
echo 'ansible_ssh_password: secure_password' > ~/.ansible/vault/ansible_ssh_pass.yml

# Encrypt the file with ansible-vault
ansible-vault encrypt ~/.ansible/vault/ansible_ssh_pass.yml
```

This newly created variable can be called in the playbooks using the same method as `ansible_become_pass`:

```
  vars_files:
  - ~/.ansible/vault/ansible_ssh_pass.yml
  - ~/.ansible/vault/ansible_become_pass.yml
```

### ❔ Using Conditions

#### 🙇 On File Existence

Sometimes when I run the `apt update && upgrade` commands, a kernel restart is required. Luckily, Ansible allows me to create conditions which I can leverage to restart the target machine if a reboot is necessary by adding the following as tasks two and three to the `apt-update-upgrade.yml` playbook: 

```
- name: Check if reboot is required
  register: reboot_required_file
  stat: path=/var/run/reboot-required

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

Task two, "Check if reboot is required," creates a variable, `reboot_required_file`, which contains information about the file found at the remote target path `/var/run/reboot-required`. Task three checks if a file exists at the specified path and resets when necessary as determined by the clause `when: reboot_required_file.stat.exists`.

The completed `apt-update-upgrade.yml` playbook now runs the update and upgrade commands, checks if a restart is required, and follows through with an update if necessary. 

[![Conditions in action](ansible-conditions.jpg "Conditions in action")](ansible-conditions.jpg)
*Conditions in action*

#### 💼 On File Contents

Conditions can also be createed to check the contents of a file, which can be leveraged by modifying `ssh-key-setup.yml` to check if the Ansible SSH key is present on the target before copying it over.

To do so, first I needed to add the following two tasks as the first and second tasks in `ssh-key-setup.yml`:

```
- name: Read the contents of the authorized_keys file
  slurp:
    path: ~/.ssh/authorized_keys
  register: authorized_keys_contents

- name: Decode the authorized_keys contents
  set_fact:
    authorized_keys_decoded: "{{ authorized_keys_contents.content | b64decode }}"
```

Here, the first tasks takes the contents of the target's `authorized_keys` file and the second decodes the base64-encoded content of this file.

Now we can use the `authorized_keys_decoded` variable to create `when` conditions in the playbook. For example, by adding the `when: "'ansible' not in authorized_keys_decoded"` clause to the end of each of the three original tasks in `ssh-key-setup.yml` (now tasks 3-5). Running this playbook will now first check the contents of the target's `authorized_keys` file and then copy the ansible public key from the control node to the target only if it is not already present on the remote server.

### 🀚 Introduction to Idempotency

Up to now, I have been using Ansible to perform actions (or not) depending on the existence/contents of a file. Through Ansible, I can also leverage idempotency, which I like to think of as declarative state. With idempotency, I can not only have Ansible follow through with conditional actions, but I can also tell Ansible what I want the desired state of my server to be. In other words, I can tell Ansible that I want a certain package to be present and Ansible will only act if necessary. 

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

The most important line here is `state: present`. This instructs Ansible to make sure that the latest qemu-guest-agent package is installed. When we run this playbook for the first time, it will install the package and result in a 'changed' status, and subsequent runs will result in the 'ok' status since the state is present as declared. 

[![Idempotency in action](ansible-idempotency.jpg "Idempotency in action")](ansible-idempotency.jpg)
*Idempotency in action*

### 🎚️ Ansible Roles from Playbooks

Roles can be used to take groups of tasks and objectify them, making them modular and reusable. What I've been writing in the playbook examples here so far are better implemented as roles which can then be called in playbooks, giving playbooks greater flexibility and modularity.

Roles are broken up into smaller pieces through the following directory structure:

```
# Create all the directories for roles
mkdir -p ansible/roles/role_name/{tasks,handlers,templates,files,vars,defaults,meta}

  roles/
  └── role_name/
      ├── tasks/
      │   └── main.yml
      ├── handlers/
      │   └── main.yml
      ├── templates/
      ├── files/
      ├── vars/
      │   └── main.yml
      ├── defaults/
      │   └── main.yml
      └── meta/
          └── main.yml
```

#### ⭕ `ssh_key_copy` Role

To demonstrate, I'll start in the same place as above by creating a role based off of `ssh-key-setup.yml`. First, I need to make the directories for the role: 

```
# Create all the directories for roles
mkdir -p ansible/roles/ssh_key_copy/{tasks,handlers,templates,files,vars,defaults,meta}
```

The tasks from the playbook should be moved over to `ansible/roles/ssh_key_copy/tasks/main.yml`:

```
---
- name: Read the contents of the authorized_keys file
  slurp:
    path: ~/.ssh/authorized_keys
  register: authorized_keys_contents

...
...

- name: Ping test group hosts using copied SSH key
  ansible.builtin.command:
    cmd: ansible {{ inventory_hostname }} -m ping --key-file ~/.ssh/ansible
  delegate_to: localhost
  ignore_errors: yes
  when: "'ansible' not in authorized_keys_decoded"
```

With the tasks in place, next up is to declare variables inside `ansible/roles/ssh_key_copy/vars/main.yml`. Since all of my Proxmox VMs have standardized users, I can tell it the name of the `ansible_user`, as well as the location of the private SSH key to use, and to turn off a warning about the location of the python interpreter:

```
# Add to `ansible/roles/ssh_key_copy/vars/main.yml`
ansible_user: justin
ansible_ssh_private_key_file: ~/.ssh/ansible
ansible_python_interpreter: auto_silent # turns off python location warning
```

There is a defined order for variables declared in multiple places, for example `inventory > playbook > role`, but this list is not exhaustive.

With the role and its default variables defined, the only thing left now is to create a new playbook with a descriptive name to call the role. I called mine `server-setup-proxmox-ubuntu2204.yml`:

```
---
- name: Init server from fresh Ubuntu install
  hosts: "*"
  vars_files:
  - ~/.ansible/vault/ansible_ssh_pass.yml
  roles:
    - ssh_key_copy
```

Running the following command will now run the new `server-setup-proxmox-ubuntu2204.yml` playbook containing the newly created role:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/server-setup-proxmox-ubuntu2204.yml --ask-vault-pass
```

#### 🖇️ Moving the Remaining Playbooks into Roles, introducing Handlers

Moving on to the second playbook, first I needed to make the appropriate directories for the `disable_password_login` role:

```
# Create all the directories for roles
mkdir -p ansible/roles/disable_password_login/{tasks,handlers,templates,files,vars,defaults,meta}
```

The file at `ansible/roles/disable_password_login/vars/main.yml` should have the same three values as the one I created at `ansible/roles/ssh_key_copy/tasks/main.yml`.

Handlers are things that might need to be to triggered in a role and have completed only once, after all of the other tasks have been run, like restarting a service. There's a handler in `disable-password-login.yml` that we can pull out and add to the appropriate file at `ansible/roles/disable_password_login/handlers/main.yml`:

```
---
- name: Restart SSH service
  service:
    name: sshd
    state: restarted
```

With the handler taken care of, the remaining four tasks from the `disable-password-login.yml` playbook could be added to `ansible/roles/disable_password_login/tasks/main.yml`. To make sure these tasks can call the handler, I needed to add `notify: Restart SSH service` to tell the playbook to invoke the handler. If the handler is invoked at any time during the role's execution, it will initiate the action.

This role requires `become: yes`, so it was included it in the playbook under the role:

```
---
- name: Init server from fresh Ubuntu install
  hosts: "*"
  vars_files:
  - ~/.ansible/vault/ansible_ssh_pass.yml
  - ~/.ansible/vault/ansible_become_pass.yml
  roles:
    - role: ssh_key_copy
    - role: disable_password_login
      become: yes
```

> It is possible to use the `become: yes` declaration for the playbook as a whole, but since it is not necessary for the `ssh_key_copy` role it was kept at the role level.

Now when I run the following command, Ansible will run the playbook containing both the `ssh_key_copy` and `disable_password_login` roles:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/server-setup-proxmox-ubuntu2204.yml --ask-vault-pass
```

I finished up the remaining two playbooks by following a similar pattern of breaking off the tasks into the appropriate files, populating the `vars/main.yml` file, paying no mind to the other directories, and adding the role to `server-setup-proxmox-ubuntu2204.yml`.

With that complete, I can now run the playbook on a freshly installed Ubuntu 22.04 server and Ansible will initiateit to my desired state:

```
ansible-playbook -i ./ansible/inventory/hosts ./ansible/server-setup-proxmox-ubuntu2204.yml --ask-vault-pass
```

### 🦾 Up Next

Now that I'm able to put a server into an initiated state, things can start to branch out from here. I should learn how to make a template so that I can skip both the manual installation phase *and* save some compute doing `apt update && apt upgrade`.

Past that, I think learning how to initate an Ansible user (and other users?) during init would add safety and be a valuable learning opportunity. 

I would also like to explore using Ansible to automate my Proxmox VM backups. This would tie nicely into an upgrade testing workflow: being able to backup, update, test, then rollback or continue in an automation would make managing a scaling number of servers much easier. 

More speficially about Ansible itself, I would like to learn more about variables and defaults as they seem like the next level of abstraction available to me through Ansible, especially since there are multiple locations to declare them which seem to have a well-defined order of precedence. 
