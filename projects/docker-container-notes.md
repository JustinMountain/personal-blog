---
title: 'Docker Container Notes'
featured: 'no'
published: '2025-01-15'
updated: '2025-06-14'
repo: ''
category: 'documentation'
tags: 'docker, homelab, selfhosting'
excerpt: 'This is where I keep notes about specific docker containers that do not (yet) require/deserve their own page.'
excerpt2: ''
thumbnail: 'docker-notes.jpg'
thumbnail-alt: 'Notes for Docker containers and deployments'
---

### Table of Contents

### 💸 Actual Budget

RBC only let me retrieve a certain amount of files through their system. I found a [script on GitHub](https://github.com/mindcruzer/rbc-statement-to-csv) which takes e-Statements from RBC credit cards and converts them into one large `.csv` file which I could import into Actual.

For Debit and Savings accounts, I used the filter funciton on the Account Summary page to select the range I wanted to import, loaded all of the entries for my range, copied them into Excel and created the appropriate columns.

Moving forward I will go to **Products & Services** > **Account Services** menu > **Download transactions**. CIBC exports to `.qfx` for *Quicken*, so I will be downloading in that filetype for consistency between the accounts.

To Download CIBC transactions, go to **More** on the left side menu, select **Download Transactions**

> *Confirmed*: Sometimes there is a delay between a purchase being made and it showing up in the account. Any transactions falling in this category will be remedied in the subsequent download, even if the date the transaction was posted has already passed.

### Home Assistant

Adding the `macvlan` bridge to the IoT network:

```
docker network create -d macvlan \
  --subnet=192.168.20.0/24 \
  --gateway=192.168.20.1 \
  -o parent=eth0 \
  iot_macvlan
```

https://www.hacs.xyz/docs/use/download/download/#to-download-hacs


### 🏠 Homepage

Using the FQDN doesn't work well with widgets/siteMonitor, for some reason. I the `.env.example` file has spots for both IP and FQDN for this reason.

### ⌨️ Code Server

Can't use the `terminal` to issue CLI commands, as it exists within the docker container 
