---
title: 'A Bespoke Blog as a Next.js Web Application'
featured: 'no'
published: ''
updated: ''
repo: 'https://github.com/JustinMountain/personal-blog'
category: ''
tags: 'aws, cloud, nextjs, docker'
excerpt: ''
excerpt2: ''
thumbnail: 'uptime-kuma-dashboard.jpg'
thumbnail-alt: 'This is not actually the right picture yet. How do I make a picture for a website?'
---

### Table of Contents

### A Bespoke Blog as a Next.js Web Application

I like working on projects that expand on what I have recently learned by pairing something that I need with something that I want to learn. In this case, I needed a home on the web and had just spent one semester interning as a web developer and another studying cloud infrastructure and network security. 

Fresh out of an internship customizing and developing  Wordpress sites at a Marketing Agency, I had just had some relatively fresh eyes and insight into how professionally designed and implemented websites flow and what they require to be considered complete. 

I took this knowledge and dove into React and Next.js. Writing a Next.js app for a personal blog is definitely over-engineered, however, I chose this route because it seemed like a good step up in skills towards being able to fully implement the types of systems I want to solve.

A personal blog doesn't require a backend, which allows me to focus on learning react and next while still pushing me into new dependencies and concepts like how React and Next handle state State. 

I focused in on a few core skills in order to get as deep knowledge as possible without spreading myself too thin. 

Iterating on these skills in the next project will allow me to again focus on a few key skills while refining the ones learned through this exercise. The focus of the next project likely being the inclusion of a PostgresSQL database, an API, and TypeScript. 





bespoke personal blog which generates markup from markdown

over-engineered
mobile-first
fully responsive
Next.js

deployed on aws ec2 behind alb and route 53 for tls/ssl encryption


### Design

#### Design Draft in Figma

Design is definitely not my strong suit. This actually makes it even more important to start from a design. Being able to iterate in Figma to create a general idea of what I wanted the website to look like was invaluable. I knew that if I just went with the flow and designed and implemented simultaneously, I would get stuck without direction. 

Even though the end result is different from the design, being able to complete the first few iterations outside of code (and a learning environment) shaved a lot of time and a ton of headaches. 

Provided much needed direction. 

I started by compiling a list of the different components that I would want to make and collected some inspiration from around the web. Once I knew what I wanted to make, I made mobile and desktop versions of each component and compiled a general flow for what I wanted to make, slowly iterating and improving along the way. 

https://www.figma.com/file/vBJbP0DIyuI6HGeUNQLHu7/Personal-Site?type=design&node-id=0-1&mode=design&t=fh1JiBER6Ivuluzm-0


#### Posts Style Guide

Once the design was in place, I definedsome style guidelines to make sure that everything would stay uniform page to page. This became especially important when I implemented the CMS for my posts, since I would be writing code snippets, descriptions, and more and I wanted to define what different emphasis meant.

**Bold** text is used to describe UI locations of different things, for example a **Settings** menu or a sub-menu choice. 

*Italic* text is used for image captions or *general emphasis* in text. 

`Inline code` is used for web addresses, filepaths, and inline code that doesn't require multiple lines. 

I try to have a consistent first-person voice as well. This blog is ultimately for me and my reference, which means a lot of the text I write ends up as me talking to myself. This can manifest in declarative *do this* but also descriptive *I did this*. It also keeps everything very personal, which for a personal blog, makes sense.

### Build / Dev

With guidance in place, it was time to implement. I chose to build this as a Next.js app as I thought it would push my existing skills in web development while also giving me space to learn. React, Next.js, and Tailwind CSS were all new to me when I started, so I decided to lean on and expand my understanding of JavaScript rather than also delving into TypeScript. I only travelled this path so I don't know if it was the right decision, but the next project will certainly utilize TypeScript while leaning on the foundation of knowledge I learned through this project in React and Next. 

#### Generating Markup from Markdown

One of the projects I worked on during my internship was implementing markup from markdown. While my responsibility was simply copying content and giving it markdown syntax, it inspired me to look into this as a solution for this project. 

I write markdown files which consist of a few lines of frontmatter for meta information about the article - title, published date, thumbnail, etc - and then write the article in markdown. The gray-matter package converts the frontmatter and content into an object that can be used in my components and [remark and rehype packages](https://github.com/JustinMountain/personal-blog/blob/main/utils/markdownToHtml.js) are then used to convert the content of the article into HTML that can be *dangerously* set into the component at runtime. 


#### Styling the Site

[Tailwind, autoprefixer, postcss] come pre-packaged with Next. Although I had never used Tailwind before, I was fairly comfortable with CSS so utilizing its utility classes was straight-forward and was easy to pick up. 

I extended Tailwind with the [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin) plugin which allows me control over the HTML generated from markdown at runtime. 


#### Cool things

Along the way, I learned some of the nuances of using React, Next.js, and webdev in general. These are the types ofthings that might come up again in the future, so I'm documenting them here for future reference.

I used React's State object to accomplish a few interesting things in this project. The list of all projects works by storing an array that contains all of the frontmatter for the files under /projects in State. Input checkboxes are created dynamically from the list of all tags from all projects. The state of the checkboxes is used to create a dictionary, which is then used to re-render the list according to the State of each checkbox (only displaying projects where all checked tags are true). A reset button is used to return the State to the default position and uncheck the inputs.

State was also used to determine the fill color of the SVGs. The SVGs were imported into the project as components, allowing me to control things like color and size. These components use `onMouseEnter` and `onMouseLeave` to change the State on hover which changes the fill color of the component. My intuition tells me that this isn't the most effective way to deal with this problem, but due to the way Next handles images and SVGs in particular, it was the best solution that I could find at the time.

I created a [custom heading component](https://github.com/JustinMountain/personal-blog/blob/main/components/utility/CustomHeading.js) to display the subheading as an in-editor comment. In this component, the subheading is rendered as a `before` CSS pseudo-class. The subhead couldn't be placed in `attr()` and generate properly; as a result I had to pass the element the custom property `before` containing the subheading, which is then used to generate the heading. React and Lint have an `react/no-unknown-property` error which would appear when using this solution. I added a rule to ignore this rule at build time to the `.eslintrc.json` file. Of course, I could've just used one `<div>` for the subheading and another for the heading. I've left this solution primarly as documentation on how I solved this particular problem in case it comes up again. 

> Your scientists were so preoccupied with whether they could, they didn't stop to think if they should.

The last part that I want to document is that the Connect form submits to Discord. Discord provides an API that is easy to use, so setting up a channel and a webhook was a straightforward process. The form also uses State to create an Object that Discord understands, which is then sent and posted in a private channel via the Webhook Bot. 

### Implementation

#### Building the Docker Images

Before I could put the blog on AWS, I knew I needed to setup a reverse proxy since Next works locally on port 3000 and I only want to expose port 80 internally within my VPC. I created/compiled a default.conf file to setup the proxy and a simple Dockerfile to load on the EC2 instance. The proxy contains some simple rate limiting as well as the structure for load balancing and a backend server, but neither of those are being used at this time. 

Once the setup is complete, running the server is as easy as building and running the container:

```
# Commands for nginx (run commands from /nginxproxy)
docker build -t nginxproxy . --no-cache
docker run -p 80:80 nginxproxy
```

At this point I also decided to containerize the Next.js application as well. This would make deploying the app easier, as I just need to setup the Dockerfile once. I chose to run PM2 to handle crashes and ensure the application stays up and running. 

```
# Commands for application (run commands from /)
docker build -t personalblog . --no-cache
docker run -p 3000:3000 personalblog
```

During testing there are a lot of files that are created. Running the following command makes sure that the dev environment stays free from digital bloat:

```
# Cleanup unused and inactive docker containers, networks, images, and cache
docker system prune
```

#### Putting it on AWS

Even though I've decided to implement Docker containers, I put them on an EC2 instance instead of using ECS. This is primilarly for practice and learning and the foundation of setting up on EC2 behind an ALB and managing all of that is part of the goal. Setting it up in this way is also describing the steps that I will automate into Infrastructure as Code and build into a CI/CD pipleline. 

Before building the instance, I made sure that I had an available domain name. I manage my domain names through [Porkbun](https://porkbun.com). Copy the four Name Servers (NS) from the domain and in AWS Route 53, create a Hosted Zone for the domain. In the Hosted Zone, create an NS record that contains the four Name Servers from the domain registrar.

The first thing that needs to be setup are the Security Groups (SGs) for the EC2 instance. There are two SGs taht need to be made for the instance:

1. Enable SSH access (port 22)
2. Enable inbound internet traffic (80 and 443)

Both of these SGs should allow all outbound (return) traffic to anywhere on the Internet.

I chose to run the Ubuntu AMI since that's what I'm running as a development server in my homelab, but any AMI should work since I've deployed the application via Docker. After booting up the instance, I ran `sudo apt update && sudo apt upgrade -y` and installed Docker. 

With Docker installed on the server, I pulled the repository to the server with `git clone <url> <name>` and changed the `upstream server` IP address to the private IP address of the EC2 instance it's being hosted on. Then I built and spun up both docker images. At this point, the application should be publically available at the EC2 instance's public IP address over HTTP.

HTTPs connections will be taken care of by the Application Load Balancer (ALB), which require a Target Group. Create a Target Group and place the EC2 instance in it. Any new instances containing the application can be placed inside the Target Group which can then be used to scale up availability or test new features.

Request a public certificate in Certificate Manager for the domain registered above. In the certificate, click **Create records in Route 53** to complete the auto-renewing SSL/TLS certificate request. 

Add an HTTPs listener to the ALB which forwards to the Target Group and select the newly created certificate from ACM for the default SSL/TLS certificate. 

To force an HTTPs connection between the client and server, edit the HTTP listener and change it so instead of forwarding to the Target Group, it redirects to the HTTPs connection on port 443. 

Finally, create an alias record for the Hosted Zone in Route 53 which points to the ALB. Once this is all setup, it could take between 24 and 48 hours for the DNS records to propgate. Once it's all setup, the Next.js web application should be available at the domain name securely over HTTPs. It took about 30 minutes when I did setup this server.

### To Do

Now that the blog is available on the internet, I can focus on optimizations and behind the scenes types of things to further my learning. The most important part is now it's online and I can reference it on [LinkedIn](https://www.linkedin.com/in/justinmountain/) and put it on my resume.

It will always be a work in progress, but it's at a point where I'm happy to share it. 

The next few upgrades will be shifting from a public VPC to a private one. I'd like to restrict access even further as a security practice. I also want to create a user script file that can be run to setup a new instance. I will need to figure out a solution to the nginx config file requiring an instance IP. Both of these are steps towards completing a CI/CD pipeline for the project. Once a new server can be automated, automating deployment on code updates will be the next step. 

#### Polish

The following things need to be addressed before this part of the project will be considered complete. These are minor things that shouldn't take too long each.

1. Mobile nav needs animation on open/close
2. Mobile nav needs *something* (full screen, opacity, ..?)
3. Consolidate to docker-compose.yaml on a separate docker network
4. Solve the 'sharp' warning that appears (also maybe some of the lazy loading?)

