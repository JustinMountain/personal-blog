---
title: ''
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

### Purpose

This is a place to keep notes abotu specific docker containers that do not (yet) require/deserve their own page.

### Actual Budget

I use RBC, which only lets me retrieve a certain amount of file through their system. I found a [script on GitHub](https://github.com/mindcruzer/rbc-statement-to-csv) which takes e-Statements from RBC credit cards and converts them into one large `.csv` file which I could import into Actual.

For Debit and Savings accounts, I used the filter funciton on the Account Summary page to select the range I wanted to import, loaded all of the entries for my range, copied them into Excel and created the appropriate columns.

Moving forward I will go to **Products & Services** > **Account Services** menu > **Download transactions**. CIBC exports to `.qfx` for *Quicken*, so I will be downloading in that filetype for consistency between the accounts.

To Download CIBC transactions, go to **More** on the left side menu, select **Download Transactions**


Sometimes there is a delay between a purchase being made and it showing up in the account. Any transactions falling in this category will be remedied in the subsequent download, even if the date the transaction was posted has already passed.


### Homepage

FQDN don't work well with widgets/siteMonitor, use IP instead.

### Code Server

Can't use the `terminal` to issue CLI commands, as it exists within the docker container 



