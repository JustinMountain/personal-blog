---
title: 'My Home on the Internet'
featured: 'no'
published: '2023-08-31'
updated: '2023-08-31'
repo: 'https://github.com/JustinMountain/personal-blog'
category: ''
tags: 'aws, cloud, nextjs, docker'
excerpt: 'I built myself a bespoke blog as a place to store my documentation and share my projects. The blog lives on AWS on an EC2 instance behind an application load balancer.'
excerpt2: 'The blog was built as a Next.js web application and deploys as a Docker container which allows for easy updates to the production environment.'
thumbnail: 'bespoke-blog.jpg'
thumbnail-alt: 'This is not actually the right picture yet. How do I make a picture for a website?'
---

### Table of Contents

### A Bespoke Blog as a Next.js Web Application

I like working on projects that that are a mix between what something I want to learn and something that I need. The golden zone is when I can also include something on that I have recently learned. This project hit all three points with app development, a personal portfolio website, and deploying to the AWS infrastrcture. 

Fresh out of an internship customizing and developing Wordpress sites for a Marketing Agency, I had experience with what funcitonality professional clients are looking for, as well as the tools and processes that an agency uses to design and implement their service. 

I chose to pursue React and Next.js instead of Wordpress even though I was designing a personal site; the over-engineering was a feature, not a bug. I'm pushing towards full stack app development and DevOps, so developing in a modern application stack was more important than speed of implementation. Although there is no backend in the current implementation, all of the pieces are in place to add one. This way, I focused this project on learning and developing the core skills and competencies of Next.js app development while also leaving a clear addition for a follow-up project. 

Iterating on these skills in the next project will allow me to again focus on a few key skills while refining the ones learned through this exercise. The focus of the next project likely being the inclusion of a PostgresSQL database, an API, and TypeScript. 

### Design

#### Design Draft in Figma

Design is definitely not my strong suit which makes it even more important to start with a design. I leveraged some of the experience I gained at the marketing agency and used [Figma](https://www.figma.com/file/vBJbP0DIyuI6HGeUNQLHu7/Personal-Site?type=design&node-id=0-1&mode=design&t=fh1JiBER6Ivuluzm-0) to iterate over some ideas and inspiration to come up with a draft. The design is ultimately just a design and the outcome will inevitably be different, but the starting point allows the first code draft to have a cohesive vision. This is invaluable and I will continue the practice in future projects.

I considered all of the different components that I would need to create and drafted what they could look on mobile as well as desktop. After a few iterations, I was was happy with the direction the site was headed.

#### Posts Style Guide

With the design in place, I defined some style guidelines to make sure that everything would stay uniform page to page. This became especially important when I implemented the CMS for my posts, since I would be writing in markdown that would contain code snippets, descriptions, and more. I wanted to define what different emphasis meant.

**Bold** text is used to describe UI locations of different things, for example a **Settings** menu or a sub-menu choice. 

*Italic* text is used for image captions or *general emphasis* in text. 

`Inline code` is used for web addresses, filepaths, and inline code that doesn't require multiple lines. 

I try to have a consistent first-person voice as well. This blog is ultimately for me and my reference, which means a lot of the text I write ends up as me talking to myself. This can manifest in declarative *do this* but also descriptive *I did this*. It also keeps everything very personal, which for a personal blog, makes sense.

### Build / Dev

With guidance in place, it was time to implement. I chose to build this as a Next.js app as and React, Next.js, and Tailwind CSS were all new to me when I started. I could have also included TypeScript, but by leaning my understanding of JavaScript rather than also also learning TypeScript, I can focus on the core of React and Next.js. This also leaves a clearly definied path for the next project-as-a-learning-experience: TypeScript, which will pair nicely with implementing a backend since type sensitivity will become more relevant when reading and writing information in a database.

#### Generating Markup from Markdown

The blog dynamically generates the project pages from markdown files. There are a few lines of frontmatter in each file which describe the metadata - title, published date, thumbnail, etc - and the rest of the file is written with markdown syntax. While this does create some limitations, the dynamic creation is an invaluable time-saver and the limitations are no more strict than more standard CMS approaches. 

A few packages are being used to accomplish this. First, the gray-matter package converts the frontmatter and content into an object that can be used in the site's components. Then, the [remark and rehype packages](https://github.com/JustinMountain/personal-blog/blob/main/utils/markdownToHtml.js) are used to convert the content of the article into HTML that can be *dangerously* set into the component at runtime. The objects and HTML are then passed as props to the page createed under a dynamic route. 

#### Styling the Site

[Tailwind, autoprefixer, postcss] come pre-packaged with Next.js. Although I had never used Tailwind, I was comfortable with CSS so utilizing Tailwind's utility classes was straight-forward and was easy to pick up. 

I extended Tailwind with the [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin) plugin to allow me to also control the styling of the HTML generated from markdown. This allowed ne to declare the style for the [dynamically created project pages](https://github.com/JustinMountain/personal-blog/blob/main/pages/projects/%5Bslug%5D.js) in one spot and in the same way as the style is being declared for the rest of the application.

#### Cool things

Along the way, I learned some of the nuances of using React, Next.js, and web development in general. As these are the types of things that might come up again in the future, I'm documenting them here for future reference.

I used React's State object to accomplish a few interesting things in this project. The list of [all projects](/projects) works by storing an array that contains all of the frontmatter for the files under /projects in State. Seperately, input checkboxes are created dynamically from the list of all tags from all projects whose state is used to create a dictionary. This dictionary is then used to re-render the list corresponding to the State of each checkbox (only displaying projects where all checked tags are true). A reset button is used to return the State to the default position and uncheck the inputs.

State was also used to determine the fill color of the SVGs. The SVGs were imported into the project as components, allowing me to control things like color and size. These components use `onMouseEnter` and `onMouseLeave` to change the State on hover which changes the fill color of the component. My intuition tells me that this isn't the most effective way to deal with this problem, but due to the way Next handles images and SVGs in particular, it was the best solution that I could find at the time.

I created a [custom heading component](https://github.com/JustinMountain/personal-blog/blob/main/components/utility/CustomHeading.js) to display the subheading as an in-editor comment. In this component, the subheading is rendered as a `before` CSS pseudo-class. The subhead couldn't be placed in `attr()` and generate properly; as a result I had to pass the element the custom property `before` containing the subheading, which is then used to generate the heading. React and Lint have an `react/no-unknown-property` rule which would generate an error when using this solution. I added a rule to ignore this rule at build time to the `.eslintrc.json` file. 

Of course, I could've just used one `<div>` for the subheading and another for the heading. I've left this solution primarly as documentation on how I solved this particular problem in case it comes up again. 

> Your scientists were so preoccupied with whether they could, they didn't stop to think if they should.

The last part that I want to document is that the Connect form submits to Discord. Discord provides an API that is easy to use, so setting up a channel and a webhook was a straightforward process. The form also uses State to create an Object that Discord understands, which is then sent and posted in a private channel via the Webhook Bot. 

### Implementation

#### Building the Docker Images

With the blog build and running locally, it was time to put it on the Internet. Next.js works over port 3000, so first I needed to setup a reverse proxy so the application would be available over port 80. To this end, I created a `default.conf` file to setup the proxy and a simple `Dockerfile` to generate an Nginx reverse proxy which could be easily deployed on EC2. The proxy contains some simple rate limiting as well as the structure for load balancing and a backend server, but neither of those are being used at this time. 

Building and running the container in development was as simple as iterating over the `default.conf` and `Dockerfile` files and running the following two commands:

```
# Commands for nginx (run commands from /nginxproxy)
docker build -t nginxproxy . --no-cache
docker run -p 80:80 nginxproxy
```

At this point I also decided to containerize the Next.js application as well. This would make deploying the app easier, as I just need to setup the `Dockerfile` once. I chose to run PM2 on the node server  as well to handle crashes and ensure the application stays up and running. 

Building and running the application container in development requires the following two commands:

```
# Commands for application (run commands from /)
docker build -t personalblog . --no-cache
docker run -p 3000:3000 personalblog
```

During testing there are a lot of files created. I run the following command after development sessions to make sure that the dev environment stays free from digital bloat:

```
# Cleanup unused and inactive docker containers, networks, images, and cache
docker system prune
```

With the two containers created, I made a simple `docker-compose.yaml` file that I can run to build both containers at the same time. The file contains the build paths for both containers, opens port 80 to the docker network, and makes the Next.js application depend on the reverse proxy. 

Now, the entire application can be spun up and accessible on port 80 of the host machine after running the command:

```
# Builds the containers and runs the application in detached mode
docker-compose up -d --build
```

#### Putting it on AWS

Even though I've decided to implement Docker containers, I put the application on an EC2 instance instead of using ECS. This is primilarly for practice managing the infrastructure of the application. Setting it up in this way is also describing the steps that I will automate into Infrastructure as Code and build into a CI/CD pipleline. 

Before building the instance, I made sure that I had an available domain name. I manage my domain names through [Porkbun](https://porkbun.com). Copy the four Name Servers (NS) from the domain and in AWS Route 53, create a Hosted Zone for the domain. In the Hosted Zone, create an NS record and paste the four Name Servers from the domain registrar.

Now I needed to create the Security Groups (SGs) for the EC2 instance. There are two SGs that needed to be made for the instance:

1. Enable SSH access (port 22)
2. Enable inbound internet traffic (ports 80 and 443)

Both of these SGs should allow all outbound (return) traffic to anywhere on the Internet.

I chose to run the Ubuntu AMI since I'm running Ubuntu on the development server in my homelab, but any AMI should work since I've deployed the application via Docker. After booting up the instance, I ran `sudo apt update && sudo apt upgrade -y` and installed Docker. 

With Docker installed on the server, I pulled the repository to the server with `git clone <url> <name>`. Then I ran `docker-compose up --build` to build and spin up the containers. After a few minutes for installation, the application should be publically available at the EC2 instance's public IP address over HTTP.

HTTPs connections are taken care of by the Application Load Balancer (ALB), which require a Target Group. I created a Target Group and placed the EC2 instance in it. Any new instances containing the application can be placed inside this Target Group which can then be used to scale up availability or test new features.

I requested a public certificate in Certificate Manager for the domain registered above. In the certificate, under **Create records in Route 53** I completed the registration for the auto-renewing SSL/TLS certificate request. 

Then I added an HTTPs listener to the ALB which forwards to the Target Group and selected the newly created certificate from ACM for the default SSL/TLS certificate. 

To force an HTTPs connection between the client and server, I edited the HTTP listener and changed it to redirects to the HTTPs connection on port 443 instead of forwarding to the Target Group. This way any attempted connections over HTTP automatically get forwarded to an HTTPs connection.

Finally, I created an alias record for the Hosted Zone in Route 53 which points to the ALB. Once of all this was setup, the Next.js web application was available at the domain name securely over HTTPs. It could take between 24 and 48 hours for the DNS records to propgate and therefore for the domain name to forward to the server correctly, but it only took about 30 minutes when I setup this server.

### To Do

Now that the blog is available on the internet, I can focus on optimizations and behind the scenes types of things to further my learning. The most important part is now it's online and I can reference it on [LinkedIn](https://www.linkedin.com/in/justinmountain/) and put it on my resume.

It will always be a work in progress, but it's at a point where I'm happy to share it. 

I want to create a user script file that can be run to setup a new instance. This should be relatively straight-forward as the steps that the script needs to complete have already been defined above. This is the next major step towards completing a CI/CD pipeline for the project. Once a new server can be automated, automating deployment on code updates will be the next step. 

As for other upgrades and optimizations, I'd like to shift from a public VPC to a private one. I'd also like a way of capturing all of the logs that the nginx container is generating and setup some pre-deployment tests. I've pushed to deployment slightly broken functions, so creating a build environment that tests to ensure a few conditions are met could be a good way of preventing that from happening or even worse: not knowing something is broken. 

#### Polish

The following things need to be addressed before this part of the project will be considered complete. These are minor things that shouldn't take too long each.

1. Mobile nav needs animation on open/close
2. Mobile nav needs *something* (full screen, opacity, ..?)
3. Do better for image optimization. Can I change what image is sent based on a media query?
