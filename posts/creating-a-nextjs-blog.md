---
title: 'Creating a Blog as a Next.js Web Application'
featured: ''
published: 'no'
updated: ''
repo: ''
category: ''
tags: ''
excerpt: ''
excerpt2: ''
thumbnail: 'uptime-kuma-dashboard.jpg'
thumbnail-alt: ''
---

### Table of Contents

### Commands

Run the server on localhost for development:
```
npm run dev
```

Build the project for production:
```
npm run build
```

Start the server for production:
```
npm run start
```

### Design Draft in Figma

https://www.figma.com/file/vBJbP0DIyuI6HGeUNQLHu7/Personal-Site?type=design&node-id=0-1&mode=design&t=fh1JiBER6Ivuluzm-0

### Building the Docker Images

```
# Commands for nginx (from /nginxproxy)
docker build -t nginxproxy . --no-cache
docker run -p 80:80 nginxproxy

# Commands for application (from /)
docker build -t personalblog . --no-cache
docker run -p 3000:3000 personalblog
```

```
# Cleanup unused and inactive docker containers, networks, images, and cache
docker system prune
```

### Used Dependencies

#### Styling

[Tailwind, autoprefixer, postcss], tailwind typography
git st
#### Markup from Markdown

gray-matter, remark, rehype, 

### Cool things

Ignoring the `react/no-unknown-property` error

Using State to manage the sortable list of all posts

SVG as components and passing hover state to change fill color

Layout mostly done with grid, mobile first, and completely responsive

Contact Form sends notification to Discord

Creating pages from markdown, various filters to make all / dynamic page and similar project cards

### Posts Style Guide

First-person voice
.yaml > .yml

#### Bold 

1. Names of UI locations: **Settings**, **Save**, etc

#### Italic:

1. Image captions.
2. In text emphasis

#### `code`

1. Addresses: `https://192.168.1.100:3000`
2. Paths: `/posts/running-docker-in-my-homelab.md`
3. Code: `mkdir directory`

### Polish

1. Mobile nav needs animation on open/close
2. Mobile nav needs *something* (full screen, opacity, ..?)
3. Social links are white, no hover effect

### To Do

0. Article summarizing the website
1. Need new profile picture (512x512) and new thank you picture for /connected
2. xs size increase px-4 to px-8 instead of md?

*Discord invite needs 30 day update unless I want to pay for the subscription (currently expires 2023/09/20)*
