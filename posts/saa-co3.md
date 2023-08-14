---
title: 'AWS Solutions Architect Associate Certification Quick Reference'
published: '2023-08-09'
updated: '2023-08-09'
repo: ''
category: 'documentation'
tags: 'aws, certification, cloud'
excerpt: 'My reference guide for the Solutions Architect Associate certification.'
thumbnail: 'aws-cert-saa-c03.jpg'
thumbnail-alt: 'Badge for the Solutions Architect Associate certification SAA-C03'
---

## AWS Associate Certification Overview

### Study Plan and Execution

I passed the Solutions Architect Associate certification SAA-C03 on 2023 August 8. While I was studying, I kept notes on the solutions to different problems. This reference guide was built from my notes as an easily searchable reference for high-level architectual solutions. 

These notes were taken from a combination of [Stephane Maarek's Ultimate AWS Certified Solutions Architect Associate SAA-C03 course on Udemy](https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/), [its six corresponding practice exams](https://www.udemy.com/course/practice-exams-aws-certified-solutions-architect-associate/), and the [the AWS documentation](https://docs.aws.amazon.com/). 

I purchased the two Udemy course packages on 2023 July 12 and sat the exam on 2023 August 8, exactly 28 days later. During these four weeks, I spent 4-5 hours per day watching lectures, practicing the labs, and reading the documentation. I came into this with no Cloud experience, but a solid grasp on many of the underlying concepts like virtualization, networking, dns, high availability, and resiliency. 

These notes are by no means exhaustive; there are services that were on my exam that are not present in this reference guide. I intend to update the guide as I continue to learn more about different solutions that can be solved through AWS architecture. 

If you find any errors or glaring omissions, don't hesitate to contact me. 

### Table of Contents

### Designing High-Performing Architectures

#### NAT Gateways vs Instances

NAT (Network Address Translation) Gateways are used in a public subnet to grant access to the Internet to instances inside a private subnet in the same VPC. They are managed by AWS, highly available (HA), and scale automatically. Network Access Control Lists (NACL) can be used to control traffic, and CloudWatch can monitor flow logs and metrics of NAT Gateways. 

NAT Instances also allow private instances to access the Internet. They can be used as a bastian server, they support port forwarding, and can be associated with Security Groups. Consider using them over NAT Gateways when full control and customization are necessary.

#### AWS DMS (Database Migration Service)

AWS DMS can help when migrating data from one source to another. The sources can be on-prem databases like Oracle or PostgresSQL and more, including S3 buckets. Destinations can include just about any place you would like to put data in AWS: PostgresSQL, DynamoDB, Redshift, Kinesis Data Streams, and more.

#### Building an RDS Index

It is possible to Byte Range Fetch the first 250 bytes of data from an object in S3 through a GET request. This data (likely metadata) can then be stored separately for quick queries that don't require the entire object. While S3 Select can scan a subset range of bytes, it is used to parallelize scanning the object. 

#### Query Caching

ElastiCache for Redis/Memcached is best used in situations where real-time transactional and analytical processing is taking place. ElastiCache supports both relational (SQL) and non-relational DB queries, but requires applications to be written specifically to utilize the caching.

Memcached is designed for *simplicity*. It works with but relationsal and NoSQL databases, but doesn't support advanced data structures, snapshots, replication, transactions, etc. 

Redis is a more feature-rich in-memory caching solution. It does not support multi-threading, but it does support the features that Memcached doesn't. Redis decreases access latency, increases throughput, and eases the load off relational or NoSQL databases and applications.

DynamoDB Accelerator (DAX) is a caching solution for DynamoDB. DynamoDB is a key-value and document DB, but DAX does not support SQL query caching. DAX can be added to DynamoDB without modifying the underlying application infrastructure.

#### S3 Storage Optimization

S3 buckets require globally unique names. Inside each bucket, it's possible to create an infinite number of prefixes (think directories) each with it's own transaction limits. Using granular bucket prefixes is an excellent way of keeping all related data together in one bucket while not limiting the number of transactions of the bucket itself.

S3 Transfer Acceleration (S3TA) can be used to speed up transfers into and out of S3 buckets, but it cannot be used for transfer from one bucket to another.

#### Syncing Large Amounts of Data On-Prem to AWS

DataSync allows us to automate copying large amounts of data from on-prem into AWS via an AWS Direct Connect (DC) connection (or Snowcone). Data can be transferred into S3 or different AWS Filesystems. File Gateway can then be setup and used to maintain access to the migrated data for ongoing updates via on-prem applications.

Interfacing between DC and Virtual Private Clouds (VPCs) requires a virtual interface (VIF). Private VIFs allow connections to the resources via their IP, Transit VIFs allow connections via a transit gateway, and a Public VIFs allow access via the Internet. 

The Storage Gateway File Gateway Service used to move from a file system like NFS or SMB to storing data in S3. Storage Gateway creates a cache that is used to deliver files from S3 over NFS or SMB. If a business instead wants to maintain their existing filesystem in AWS, then choosing a service specific to the filesystem (Amazon FSx for Windows File Server) and a its appropriate File Gateway is required.

#### Using AWS with Microsoft Active Directory (AD)

AWS Managed Microsoft AD can be used to create a workflow between on-prem Microsoft AD and the AWS Cloud. Resources in either location can be accessed by users in AD and it can be used to run directory-aware workloads on AWS. 

Simple AD is a subset of features offered with AWS Managed Microsoft AD for smaller userbases and when trust relationships with other domains is not necessary.

AD Connect simply connects on-prem AD to AWS and allows AD users to access AWS applications with their AD credentials.

#### The Quirks of DynamoDB

DynamoDB can be given access to VPCs via a gateway endpoint. This endpoint must be properly configured, but it allows instances within a VPC to communicate with DynamoDB without going over the internet. The only other service which gets this type of treatment is S3. Other services can be granted this type of access through a PrivateLink connection.

The size limit on items in a table is 400KB. For files larger than this, Aurora is the better AWS managed solution. 

#### The Quirks of Lambda Functions

Lambda functions work through an AWS VPC by default (and go over the public internet). If they need access to private resources then they need to become VPC-enabled and the VPC/subnet routing rules will need to be considered. If the same functions also require internet access, then they will need to be routed through a NAT Gateway or Instance. 

Lambda has a concurrency limit of 1,000 executions per account per region. It is often paired with other serverless services like Simple Notification Service (SNS), which have no problems scaling past this limit. As a result, if more than 1,000 concurrent executions per account per region are required, then the limit needs to be increased by contacting AWS Support. 

#### Ensuring High Performance and Availability for Applications

Global Accelerator (GA) helps ensure clients have as-quick-as-possible connections into AWS infrastructure. It works at the network level by acting as a fixed entry point into an application. It routes traffic to Edge Locations into the AWS infrastructure, where it then travels to the appropriate region and availability zone. Target endpoints for GA can include Application Load Balancers (ALBs), Network Load Balancers (NLBs), Elastic IPs, and more.

Route 53 can also be used to weight traffic to multiple destinations, but doing so is hampered by DNS caching, so should be avoided when an intentional distribution of clients is required (like in A-B testing).

Global Accelerator is different from CloudFront, which is a Content Delivery Network (CDN) which caches data at Edge Locations for faster delievery to clients. CloudFront is best used with objects or data that is under 1 GB and for larger objects S3 Transfer Acceleration will reduce the latency for geographically dispersed users.

When wanting to restrict content to authorized end users (for example paying customers), CloudFront signed URLs and cookies can both be used to verify user identity. 

#### Storing Redshift Data Long-Term

Redshift is a fully managed and clustered data warehousing solution for large-scale storage and analysis. By storing data in Redshift, it's possible to run complex analytic queries against petabytes of structured data in parallel. 

By leveraging the Redshift Spectrum layer, it's possible to store data in S3 and store references to the data in Spectrum. This is a separate layer which saves CPU processing on the main Redshift cluster.

#### Requiring a Clustered, High-Performance File System

Lustre FSx is used for High-Performance Computing (HPC) tasks like Machine Learning (ML), video processing, and design automation and should be used when the workloads need to have the fastest possible storage. Lustre also integrates with S3, which means HPC tasks can have access to long-term data as well as any real-time data that is required for the task. 

#### Requiring a Clustered, Highly Communicative Group

Elastic Fabric Adapter (EFA) enables communication with highly connected applications that are highly communicative. EFA allows new instances to integrate into the application cluster to easily scale these types of applications. If an Elastic Load Balacner (ELB) helps distribute request amongst a group of servers, the EFA distributes requests into a cluster.

#### Distributing Requests 

Network Load Balancers (NLBs) work on Layer 4 to distribute connections to private servers (IP and Port) in a VPC. The target can be an instance ID (which is converted to the instance's private IP before being forwarded) or a hard-coded Private IP. In the case of forwarding to a hard-coded IP, the IP should be mapped to an Elastic Network Interface (ENI) which itself could be moved from instance to instance.

An instance could have multiple ENIs, allowing multiple applications to run on the same instance on the same port. 

Application Load Balancers (ALBs) can route a request to a service based on the content of the request, including host-based (*.example.com), path-based (example.com/test) routing, HTTP header/method, and more.

Cross-zone load balancing considers the number of targets independent of which AZ those targets are in, equally weighting distribution to each target. With cross-zone load balancing disabled, then distribution is done evenly among the AZs, regardless of the number of targets within the AZ. By default, cross-zone load balancing is enabled for ALB and disabled for NLB.

#### Performance Targets in Auto-Scaling Groups (ASG)

In the situation where we have a specific target on an instance (for example, CPU utilization or active request count), it's possible to utilize a target tracking policy on the ASG. Target tracking policies leverage CloudWatch alarms to trigger scaling using best-effort to maintain the desired target. As a target tracking policy detects changes in the monitored metric, it scales accordingly. 

With simple target tracking, the policy needs to wait for the cooldown period to end and a health check to be completed after a scaling activity before responding to more alarms, which causes simple scaling to occur less rapidly than target tracking. 

#### EC2 Instance Hibernation

Instance hibernation suspends rather than terminates an instance. The RAM contents are saved to the root EBS volume, which is persisted instead of terminated. When the instance is restarted, root volume is re-attached and the instance resumes. The EBS storage must be paid for in hibernation state, but it's not necessary to pay for the instance itself which can potentially save money and downtime for an application.

When stopping the instance rather than hibernating it the RAM contents are not saved, but like hibernation any Public IPs (that aren't elastic) are released. 

#### Matching Availability Zones Across Accounts

The Availability Zone `us-east-1a` for one AWS account might not be the same location as `us-east-1a` for another AWS account and we can use the AZ ID to identify the location of our resources. When trying to share subnets between accounts from the same AZ, the AZ ID must also be the same.

#### CloudFormation and StackSets

CloudFormation templates are used to describe the resources necessary to run an application. StackSets work on top of templates by defining a template which is then used as the basis for provisioning stacks into different AWS Accounts under an AWS Organization.

#### Serverless Automation of Data Analysis 

Athena is a serverless service used to analyze data in S3 using SQL. Start by defining the schema then simply query using standard SQL. 

QuickSight is used to visualize data in graphs, charts, and dashboards. 

Big Data type analysis that requires reading data from and outputting back to S3 would typically be done using AWS Glue and Amazon EMR. Glue is used as the ETL tool and EMR handles the processing of the data on clustered instances. 

#### Kinesis Data Streams (KDS) v Kinesis Data Firehose (KDF)

Kinesis Data Streams is a service which captures and processes data to be stored. Data that goes through KDS can be processed with Lambda or Kinesis Data Analytics, be used a source for KDF, and more. KDS decouples the producers and consumers for real-time data processing. It requires manual administration and provisioning of shards.

Amazon Kinesis Data Firehose is the easiest way to reliably load streaming data into data lakes, data stores, and analytics tools. It can also batch, compress, transform, and encrypt the data before loading it, minimizing the amount of storage used at the destination and increasing security.

### Designing Resilient Architectures

#### Persistant Storage for Resistant Applications

When requiring an instance to have persistant access to a dataset, then Instance Store is a way of maintaining temporary data across a fleet of instances. This is because the data will persist through the loss of an instance to be available for use by its replacement. However, data on terminated, stopped, or hibernated instances will be lost. Instance store volumes also cannot be detached from one instance to be re-attached to another.

Instance Store volumes are provided by hardware connected to the host computer and offer high-performance (high I/O performance) for caching data. 

#### Multi-AZ vs Read Replica Scaling

Scaling via Read Replicas is best used when we want to scale access to information for read-intensive tasks. 

Scaling to a Multi-AZ configuration should be considered when scaling database availability (and redundancy) is required.

#### Database Replication 

Most databases in AWS use synchronous replication for Multi-AZ and asynchronous replication for Multi-Region and Read Replica replication. 

Aurora DBs are an outlier and utilize asynchronous replication across Multi-AZ, Multi-Region, and Read Replica replication. 

#### Amazon Aurora DB Clusters and Read Replicas

Aurora DB clusters split the DB compute from storage. This allows one Primary Instance to read and write to the storage and separate Read Replica instances can be created as necessary to read the data in shared storage. 

Separating read and write tasks to separate instances allows for greater control and separation of tasks while also generating failover instances for greater resiliency. When setting up the DB in this way, Read Only tasks should be pointed to the Read Only endpoint to ensure proper off-load of read actions to the Read Replicas. 

Read Replicas are assigned a priority tier (0 - 15) and in the case of failover, the highest tier Read Replica is promoted. When There are multiple Read Replicas in the same tier, the one with the largest size will be promoted.

Aurora Replicas should be used when wanting to ensure the smallest possible latency between replications. 

Using DB cloning, it's easy to setup development DB instances that have up-to-date data (though it will stop being up-to-date after the cloning is finished).

#### Relational Database Service (RDS) Database Upgrades

RDS Database upgrades require scheduled downtime. Even in Multi-AZ situations, the upgrade is applied to all instances at the same time. As a result, it is best to make a data-driven decision on to do the upgrade as the entire database will be down until the upgrade is complete.

OS-level upgrades behave differently. First, the update is applied to the standby instance which is then promoted to primary. The old primary instance is then updated and continues on as the standby instance.

#### S3 Batch Replication

S3 Batch Replication is used when a one-time copy of the data is required from a bucket in one region to another bucket in a different region. It replicates objects that existed before a replication configuration was in place, objects that have previously been replicated, and objects that have failed replication. 

#### De-coupling System Architecture

Amazon Simple Notification Service (SNS) can be integrated with other AWS services to de-couple architecture that uses event-based notifications. EventBridge is a more customizable service that is used to de-couple architecture and should be used if the integration requires notifications from- or reactions to- third-party (SaaS) services. 

#### Throttling and Buffering Traffic

API Gateway, Simple Queue Service (SQS), and Kinesis all have built-in capabilities which respond to sudden spikes in traffic. API Gateway throttles API requests based on the 'token bucket algorithm,' which sets rates against all APIs in the account. SQS has a buffer which helps spread incoming loads to multiple servers, which can smooth out temporary spikes in request volume. Kinesis is built to buffer and process data in real-time. 

#### Auto Scaling Groups (ASGs)

Launch Configurations (legacy) are templates that determine which instances will be spun up when an ASG requires a new instance. While the conditions of scaling can be re-tooled, the Launch Configurations (legacy) cannot be changed. If, for example, the Instance Type needs to be changed, a new template should be made with the new instance. The ASG can then be modified to use the new template and the old one can be deleted. 

Scheduled actions allow us to implement dynamic changes to the ASG. Using scheduled actions, it's possible to set a different range or desired size over a period of time, for example when knowing extra compute is needed for End-of-Month analyis. 

When using Health Checks to determine instance status for scaling, there is a grace period where the health check does not perform after the instance starts up. During this period, scaling up or down will not be done based on the health of the instance. There may also be an *impaired* status postponing scaling actions, which occurs when CloudWatch doesn't have enough information to instigate the scaling action (possibly as it waits for the instance to recover).

When an instance is marked unhealthy, the ASG creates a scaling activity to terminate the unhealthy instance and terminates it. Then, the ASG creates another scaling activity to replace the instance and initiates the new instance.

Custom checks can also be created and used to determine scaling.

Elastic Load Balancer (ELB) health check status is independent of ASG health status. Checking which is being used to determine scaling may help identify why unhealthy instances are not being terminated. 

Connection Draining is used to ensure that the LB allows in-flight requests to instances that are de-registering (or marked unhealthy) to continue to be sent during a timeout period. This allows active connections to be maintained while the ASG scales down or terminates an unhealthy instance.

When deciding which instance to terminate, the ASG follows a predictable pattern: 

1. Determine the allocation strategy (on-demand v spot instances)
2. Check for an instance with a Launch Configuration (legacy) and choose the oldest
3. Check for the instance with the oldest Launch Template
4. In the case of a tie, terminate the instance which is closest to the next billing hour

#### Ensuring Healthy Targets for Load Balancers

For web services that are behind a load balancer, the ALB is best. HTTP Health Checks are sent to each application server to ensure that any traffic forwarded to the server will be accepted. As soon as an unhealthy instance is detected, the ASG will start generating a replacement instance. 

When ELBs are placed behind Route 53, Route 53 health checks will check the instance itself, rather than the instance's availability on a certain port like ALB health checks. 

Route 53 DNS failover can determine which IP to send clients to by leveraging ALB health check info, ensuring that it is forwarding traffic to healthy instances. 

#### Simple Queue Service (SQS)

SQS de-couples application infrastructure by providing a location to send actions, which can then be polled by consumer applications. 

SQS queues come in two different flavours: Standard and First-In-First-Out (FIFO). If order matters, raw throughput must be sacrificed. FIFO queues can process 300 messages/second without batching and 3,000 messages/second with batching. 

SQS queues cannot be changed from one type to another; if change is necessary, the queue must be recreated. 

SQS can be used as the target for S3 event notifications, however this is limited to standard queues. 

Simple Notification Service provides a similar service that is more flexible. It can be connected with multiple subscribers in a pub/sub model.

#### Amazon Machine Images (AMIs) and Snapshots

AMIs are based on an instance snapshot. This means that if an AMI is copied from one region to another a snapshot will automatically be created (the AMI requires a snapshot in the region).

#### Redundant Direct Connect Connections to AWS

It is possible to connect multiple Direct Connect connections to a VPC using AWS Site-to-Site VPN. A setup like this will provide a consistent network experience between on-prem servers and an AWS VPC that is IPsec-encrypted. 

#### Highly Availability Through Placement Groups

For distributed workloads like Hadoop, Cassandra, and Kafka, utilizing a **partition** placement group will ensure that the hardware of different EC2 instance groups are physically different. This reduces the likelihood of multiple instances failing due to correlated hardware failure.

The **spread** placement group pushes the separation even further, ensuring that each instance is isolated on different underlying hardware. These spread placement groups can span multiple AZs in one region and it's possible to have up to 7 instances per AZ per group.

#### Instance Recovery

A CloudWatch alarm can be used to recover an EC2 instance that suffers from an underlying failure that is not termination. An instance recovered in this way retains its instance ID, private (and public, if applicable) IP addresses, Elastic IP addresses, and all instance metadata. Notably, any data that is in-memory will be lost and instance store volumes are not supported for automatic recovery.

#### Disaster Recovery Solutions

There are different strategies that can be employed for Disaster Recovery (DR) situations. These are primarily measured in the time it takes to get back up and running after disaster and the ongoing costs associated with the DR plan.

```
# More time & less cost to less time & more cost

Backup and Restore > Pilot Light > Warm Standby > Active-Active / Multi-Site
```

Pilot Light recovery is when the recovery environment is setup but must be turned on. This process can be automated (via CloudWatch).

Warm Standby recovery is when there is an active recovery environment setup at a basic level, which only needs to be scaled up to production capacity.

Active-Active / Multi-Site recovery is when a production-ready environment is ready and waiting to take over in case of disaster.

#### NS v MX v Alias v CNAME Records

CNAME records are used to point a domain or sub-domain to another domain record (NOT an IP address nor the top node of the namespace for the sub-domain).

```
# CNAME Example
blog.example.com redirects to example.com
example.com cannot redirect to blog.example.com
```

Alias records extend CNAME capabilities to the top node of a namespace, allowing domains to be re-directed to sub-domains. Using Alias records, it's possible to re-direct queries to AWS resources (CloudFront, S3, etc) free of charge when a CNAME query to the same resource would cost money.

```
# Alias Example
blog.example.com can re-direct to example.com
example.com can re-direct to blog.example.com
```

NS records are used to tell public inquiries where to find the DNS resolution for a given domain. 

```
# NS Example
The IP for example.com will be found on the server @ ns1.dnsserver.com
```

MX records direct email to mail servers. 

### Designing Secure Architectures

#### Using Lambda Functions Across Accounts

When wanting to access resources in another account from Lambda, it's important to setup both the Lambda and target with the proper roles and policies. 

For example, when a Lambda function requires access to another account's S3 bucket, an IAM role must be properly setup for the Lambda funciton and the S3 bucket must also grant access to that IAM role.

#### S3 Encryption

S3 can protect data at rest using client- or server-side encryption and data in transit using HTTPS (TLS). Metadata included with the object (not the object itself) is not encrytped and AWS recommends that customers not place sensitive information in Amazon S3 metadata.

To encrypt an object at the time of upload, you need to add a header called `x-amz-server-side-encryption` to the S3 Put request request to tell S3 to encrypt the object using SSE-C, SSE-S3, or SSE-KMS. This was changed to be the default behaviour in 2023-January.

Server-side encryption with Amazon S3 managed keys (SSE-S3) can encrypt each piece of uploaded data with a separate key. These keys are encrypted again with another regularly rotated root key. These AWS managed keys cannot be audited or tracked with CloudTrail.

#### Using S3 Across Accounts

S3 bucket policies are the best place to configure access to S3 buckets, as they are the most flexible and control access for users within the AWS Account and grant access to other AWS Accounts.

By default, an S3 object is owned by the AWS Account that uploaded it. This means that the owner of the S3 bucket will not be automatically granted access to the contents uplaoded by another AWS Account unless given access via a bucket policy.

#### Identity and Access Management (IAM) Policies

IAM policies and identities are used to describe which actions are allowed or restricted to users and groups.

The `AdministratorAccess` managed policy grants a group or user nearly unlimited power within the AWS account. The following are the changes only the root user can modify: change account name, root password, or root email address, change the AWS support plan, close the AWS account, enable MFA on S3 bucket delete, create Cloudfront key pairs, and register for GovCloud.

Permission boundaries can be added to roles and users, but **not** IAM groups. These boundaries define the maximum permissions for the user or role. 

The only resource-based policy that is supported by IAM is Trust Policies. This is because they are applied to IAM roles, which are themselves both identities and resources that are applied to users and roles. 

In the case of mixed permissions based on having multiple policies applied to a user or group, explicit deny will take precedence.

#### Tracking Activity

CloudTrail can be enabled to track all IAM activity across all accounts within an AWS Organization. Enabling this ensures that all IAM actions can be monitored and autited. 

CloudWatch is used to monitor performance events and alerts. 

AWS Config can be used to monitor resource-specific history for auditing and compliance purposes. 

#### Monitoring Third-Party TLS Certificates

By setting up a managed rule through AWS Config, it's possible to monitor 3rd-party certificates. AWS Certificate Manager (ACM) can check to see if any TLC Certificates are marked for expiration within a set timeframe. By setting up an AWS Config managed rule, an SNS topic can watch the rules' alert status to create a call for action before the certificate expires.

#### Stateless and Stateful APIs

By leveraging the AWS API Gateway, it's possible to utilize both stateless and stateful client-server communications. Through API Gateway, it's possible to create stateless RESTful APIs for the standard GET, POST, PUT, and DELETE methods as well as stateful WebSocket APIs for full-duplex communication between client and server.

#### Stateless and Stateful Access

Security Groups (SGs) are attached to the instances themselves and Network Access Control Lists (NACLs) operate on the subnet, and can both be used to mimic some duties similar to a firewall. SGs are stateful (return traffic is allowed by default) and NACLs are stateless (return traffic needs to be explicitly allowed).

AWS Firewall Manager can be used to control and configure AWS WAF, Shield Advanced, and SGs in an Organization. It cannot, however, be used to control NACLs within the accounts. 

#### VPC Sharing, VPC Peering, and VPC Endpoints

VPC Sharing allows multiple AWS accounts under the same Organization to create resources within shared and centrally managed VPCs. Resources within shared subnets within a shared VPC can be read, created, and modified, and deleted by any participant account.

VPC Peering allows two or more VPCs to route traffic between one another. Peering is non-transitive, and connections between two VPCs must be explicitly defined. 

When the mesh of required communication starts to look like a star, it may be worth considering a shared services VPC for the services that are required by multiple VPCs. This will allow some simplification of the VPC Peers and further decouple the infrastructure. 

When EC2 instances are located in a private subnet and want access to other AWS services securely, it's possible to create a VPC gateway endpoint that will give the EC2 instances private access to DynamoDB and S3 via the AWS infrastructure. The Route Table of the VPC also needs to have these endpoints setup correctly as target entries. Connecting to DynamoDB and S3 in this way is more secure and quicker than going over the internet.

For services other than DynamoDB and S3, a PrivateLink connection can establish a VPC endpoint for secure connection into a VPC that doesn't require being routed over the Internet.

#### Threat Detection

AWS GuardDuty monitors for malicious activity on CloudTrail, VPC Flow Logs, and DNS Logs. It works by continually accessing network, account, and data access activity using Machine Learning. It can be integrated with CloudWatch Events to create actionable events on threat discovery. 

Threat detection can be suspended or disabled. Suspending service simply stops GuardDuty from collecting data and disabling the service removes all findings and configurations. 

#### Checking for Vulnerabilities

The Amazon Inspector tool provides a security assessment of EC2 instances by checking for network accessibility and instance vulnerabilities. The tool offers checks based on common best practices and known vulnerabilites. 

#### Amazon Cognito User Pools

A User Pool is a database of users who are authorized to use the application (more accurately: authorized to make certain API calls). User management can be done with built-in tools or integrated with external providers like Facebook, Google, Amazon, and more. This is done on the Application load Balancer (ALB) and helps alleviate authentication pressure from application servers.

#### Restricting Application Access

AWS Web Application Firewall (WAF) is used in tandem with CloudFront, ALBs, API Gateway, or AppSync to filter traffic based on pre-determined conditions. Through the WAF, we can restrict access based on a number of factors including IP range and Geolocation. 

#### Protecting Sensitive Data

When using a CloudFront distribution, field level encrytion should be sent via the POST request. In this way, it is possible to select an encryption key to be applied selectively to specified fields within the request.

#### Protecting Keys

AWS Key Management Service (KMS) enables easy creation and management of keys to use across various services. KMS enforces a 30-day waiting period before keys are deleted (this includes Customer Managed Keys). This 30 day period can be reduced down to 7 days and during this time the keys are considered 'pending deletion.'

KMS Customer Managed Keys (CMKs) can be shared with other AWS Accounts by add the account to the key policy. This allows the sharing of encrypted data as necessary (share with an auditor).

Multi-Region keys can be enabled, but they cannot be converted from single-region keys. Using multi-region keys ensures that encryption calls are not being made between regions.

#### DynamoDB Table Encryption

By default, AWS owned CMKs are used to encrypt all DynamoDB tables. The keys are fully managed and rotated by AWS and as a result, you cannot view, use, track, or audit them (including CloudTrail).

#### Dedicated Instances and Dedicate Hosts

Both of these provide EC2 instances that are on hardware dedicated for one AWS account which is physically separate from instances in other accounts. Dedicated Hosts provide more visibility and control of the underlying hardware, and cost more. They enable services like supporting Bring Your Own License (BYOL) agreements.

Instances that are launched in dedicated or host mode can be switched to the other, but tenancy cannot move from default to dedicated/host or vice versa.

#### Service Control Policies (SCPs)

SCPs control the maximum permissions allowed for all accounts in an AWS Organization. These policies control which resources, services, etc users and roles in AWS Member Accounts (including the root user) can access within the Organization. For example, this could prevent member accounts from changing AWS CloudTrail configurations to ensure compliance with business rules and regulations. 

They don't, however, effect service-linked roles which allow other AWS services to integrate with Organizations. 

#### Preventing Deletion and Regulatory Compliance

It's possible to store data in S3 Glacier vault. Using compliance controls for individual S3 Glacier vaults, we can determine lock policies which govern how data will be kept. Policies can be things like “write once read many” (WORM) and lock the policy from future edits. 

#### Protection Against Co-ordinated Attacks 

AWS Shield provides some network and transport layer protections for EC2, ELB, CloudFront, Global Accelerator, and Route 53 resources against co-ordinated attacked. 

AWS Shield Advanced provides additional detection and mitigation against large and sophisticated DDoS attacks, near real-time visibility into attacks, and integrates with AWS WAF. Shield Advanced also grants access to the AWS DDoS Response Team (DRT) and prevents incurring costs against spikes that are the result of DDoS attacks. 

### Designing Cost-Optimized Architectures

#### Provisioning On-Demand and Spot Instances

If a mix of on-demand and spot instances is desired for a workload, then a Launch Template must be used. Multiple versions of Launch Templates can be used at the same time, whereas with a Launch Configuration (legacy) it's required to declare a single instance type. Through Extended Configurations, Launch Templates can contain multiple instance types, which can be distributed based on weights. 

After being locked, the Launch Template becomes immutable and any changes require a new Launch Template to be created. 

#### Infrequently Accessed Data

For infrequently accessed data, it is possible to put it on a different storage tier to save money. After data has been in S3 Standard for 30 days, it is possible to transition it to Standard-IA or One Zone-IA. 

For data that is re-creatable, the Multi-Zone redundancy of Standard-IA could be deemed unneccesary as opting for One Zone-IA enables even more cost savings. 

#### Short Timeframe Moving On-Prem to AWS

When needing to transfer workloads into AWS relatively quickly and efficiently, the two best options are Snowball Edge Storage Optimized devices (TB scale datasets) and a Site-to-Site VPN connection. Which option is better depends on factors like network connectivity speed, workload size, and the timeframe. 

For medium timeline tasks, Snowball Edge devices can each store up to 80 TB of data and up to 40Gb of network connectivity. When considering a Site-to-Site VPN, it's important to account for how long transferring the load into AWS will take. 

When using Snowball devices to transfer data into S3, it's possible to use a zero-day lifecycle policy to transfer the data from S3 Standard to S3 Glacier Deep Archive, bypassing the 30 day requirement above.

For >10 PB scale data transfer, Snowmobile containers are required. The timeline for Snowmobile is in multiple weeks.

#### Resource Sharing

Resources across different AWS Accounts can be shared using AWS Resource Access Manager (RAM) as long as the accounts are in the same AWS Organization. Using RAM, it's possible to setup VPC Sharing and a shared subnet where EC2 instances from different accounts can easily communicate together as they would be created and deployed within the same VPC.

#### Spot Instances and Spot Blocks

Spot Intances are designed to open requests to unused EC2 instances at a discount. These instances are much cheaper than the on-demand pricing and can be terminated if the instance is demanded. Persistent spot requests will attempt to restart the instance if it is taken over. 

It is possible to define a duration for a Spot Instance, called a Spot Block. These blocks are designed not to be interrupted, however they might be if capacity needs on the underlying instance require it. 

Cancelling a Spot Request does *not* terminate the an instance associated with the request.

1. Thumbnail
