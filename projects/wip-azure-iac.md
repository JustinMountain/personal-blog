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

### Intro

[![Vizualization of the minimal Azure configuration](azure-example-min.jpg "Minimal Azure Configuration")](azure-example-min.jpg)
*Vizualization of the minimal Azure configuration.*

This documentation pairs with `v1-monorepo` and `v2-modules` examples in the `azure-iac-examples` in order to outline the basics of Terraform. 

### Setting Up the Local Environment

0. [Install Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
1. Ensure there is an active subscription on Azure
2. Install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-linux?pivots=apt) [in WSL](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
3. `az login`, login via the link, choose the subscription/tenant, `az account show` to output the active subscription

#### v1 Monorepo

The Terraform component of this project is contained within two files in the `/terraform` directory: `main.tf` and `variables.tf`. Together, these two files represent the declarations for the minimum requirements to spin up a virtual machine in Azure. 

`main.tf` can more or less be read from top to bottom to see how Terraform will initialize the different components, with subsequent blocks being dependent on the blocks above and referencing `variables.tf` as necessary. 

Running `terraform init` and `terraform plan` while inside the `/terraform` directory, after successfully logging into azure, should output the list of actions that terraform will perform on Azure to create the VM as described by the Terraform code. 

##### Probably need to do

1. Remove Ansible/Docker components so this example focuses on TF
1. Maybe I just embrace the monorepo of it all, leaving it mostly as is

#### v2 Modules

I need to create this module based file from v1. It needs to do the following:

1. Modularize the different components into separate directories
1. Continue to have the same output at the end of running `terraform plan`
1. Removing Ansible/Docker from this repo allows me to focus here on just the Infrastructure part

##### Probably need to do

1. Remove Ansible/Docker components so this example focuses modules

#### Other Examples

1. Make manual `terraform apply` and `terraform destroy` actions to spin these up in the cloud.
  1. This will mean putting state in Azure



1. Running Ansible off Terraform changes

#### Other Documentation: CI/CD

1. Show a proper separation of tools: Terraform, Ansible, CI/CD each with its own repo


#### Summary

Doing the above would leave me with: 

1. Monorepo with Terraform, Ansible, GH Actions CI/CD to deploy nginx to Azure
1. Terraform-only version of the above broken down into constituent modules
  1. This would represent the end of this documentation article
1. Another documentation article focusing on CI/CD and how to make the tools work together in separate repos





### Next



### Commands / Tips

`terraform fmt` to format the `.yml` file to Terraform standards.
`terraform validate` checks for proper syntax
`terraform init` to initialize the local backend for Terraform (used to manage state)
 - Only cares about provider related syntax
`terraform plan` to outline the changes that will be made
`terraform apply` to apply changes to Azure
 - Will ask for confirmation without the `-auto-approve` flag
`terraform plan -destroy` shows the plan for what will be torn down 
`terraform apply -destroy` tears down the terraform plan
`terraform destroy` alias for `terraform apply -destroy`
`terraform state list` will show all of the active resources
`terraform state show <name>` displays info about a specific resource
`terraform show` displays info about all resources

`lsb_release -a` outputs the distro info of the VM
`ssh -i ~/.ssh/exampleazurekey adminuser@ip.addr` to ssh into the VM

`terraform apply -replace azurerm_linux_virtual_machine.example-vm` will replace the VM by recreating it. This is necessary for things that aren't captured by state (like provisioners)

`terraform apply -refresh-only` will refresh resources as required
`terraform output` will output any *output* blocks in the Terraform file
`terraform output <name>` will output only the named block
`terraform console` allows searching for and outputting objects in state






#### Referencing Resources

We can reference resources with the resource address `resource_type.declared_name.attribute` like `azurerm_resource_group.example-rg.name`
 - This creates an implicit dependency

#### Files

`terraform.state.backup` contains the previous active state, and can replace the `terraform.state` file if a change needs to be rolled back.


#### Variables

We can define variables a number of ways. Each of the following methods of defining variables will supercede the one above it.

1) Can be defined in a `variables.tf` file:

```
variable "host_os" {
  type = string
  default = "windows"
}
```

2) Can be defined in a `terraform.tfvars` file:

```
host_os = "windows"

```

3) Can be defined in the command line:

```
terraform apply -var="host_os=linux"
```

A specific file containing a set of variables can also be defined:

```
terraform apply -var-file="variables.tfvars"

```



### Connecting with Ansible

Install the plugin to allow dynamically created inventory files
`ansible-galaxy collection install cloud.terraform`

`inventory.yml` reference the above plugin
`playbook.yml` to declare plays

Terraform resources to:
1) wait for public ip to populate
2) create inventory hosts list
3) 

### Authenticating Azure with GitHub Actions using OIDC

#### Setup the Azure Environment

First, we need to setup Azure to use OIDC to authenticate with GitHub Actions:

1. In Azure, go to **App Registrations** > **New Registration** and add a name (I chose oidc-github-actions), select the account type and register.
2. Enter the newly created App Registration, and go to **Manage** > **Certificates & secrets** and click on **Federated secrets** amd **Add credential**
3. Choose **GitHub Actions deploying Azure resources**, fill out the GitHub account and repo information, and give it a name and description.
4. Add another one for Pull Requests
5. Grant these new App Registrations permission to make changes on the subscription by going to **Subscriptions** > select the appropriate subscription > find **Access Control (IAM)** > **Add role assignment** > click **Members** > click **+Select members** > search for and select the named App Registration (Service Principal)
6. Give it a meaningful description (Grants the `oidc-github-actions` App Registration Contributor access to the subscription)
7. Confirm under **Access Control (IAM)** > **Role assignments**

Next, we need to create a storage account to store the Terraform state files:

1. Go to **Storage accounts** > Click on **Create**
2. Select a Resource Group or create one (I used `tf-state-storage`)
3. Choose a *Storage account name* (I used `iacpersonal`) `iacpersonal_1724788567168`
4. Choose the correct *Region*, select **Azure Blob Storage**, **Backup and Archive**, and the rest as appropriatae
5. When the Storage account has been created, go to **Data storage** > **Containers** and create a new Container with a unique name (I used `personal-iac-tf-state`)


#### Setup the GitHub Environment

1. Go to **Settings** > **Secrets** to add the following secrets:

```
# Client (Application) ID of the Service Principal
AZURE_CLIENT_ID

# Azure AD Tenant (Directory) ID of the Service Principal
AZURE_TENANT_ID

# Subscription ID where the resources will be deployed
AZURE_SUBSCRIPTION_ID

# Name of the Resource Group created for storing TF state files
AZURE_STORAGE_RESOURCE_GROUP_NAME 

# Name of the Storage Account created for storing TF state files
AZURE_STORAGE_ACCOUNT_NAME

# Name of the Container created for storing TF state files
AZURE_STORAGE_CONTAINER_NAME
```








Inside the Terraform block, we must add the `backend "azurerm" {}` block:

```
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.0.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = ""
    storage_account_name = ""
    container_name       = ""
    key                  = ""
  }
}
```

### TO DO

2. SSH Keys
3. Install Ansible to runner
4. Branch workflow outline
5. Figure out how to have dev and live environments
6. Clean up `main.tf` into smaller sections, if possible
  - terraform block, init statements, terraform section(s), ansible section(s)
7. Self-host runner
