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

### To Do

0. [Install Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
1. Ensure there is an active subscription on Azure
2. Install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-linux?pivots=apt) [in WSL](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
3. `az login`, login via the link, choose the subscription/tenant, `az account show` to output the active subscription
4. 


### Connecting with Ansible

Install the plugin to allow dynamically created inventory files
`ansible-galaxy collection install cloud.terraform`

`inventory.yml` reference the above plugin
`playbook.yml` to declare plays

Terraform resources to:
1) wait for public ip to populate
2) create inventory hosts list
3) 
