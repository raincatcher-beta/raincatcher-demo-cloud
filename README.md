# FeedHenry RainCatcher Cloud 
[![Dependency Status](https://img.shields.io/david/feedhenry-raincatcher/raincatcher-demo-cloud.svg?style=flat-square)](https://david-dm.org/feedhenry-raincatcher/raincatcher-demo-cloud)
[![Build Status](https://travis-ci.org/feedhenry-raincatcher/raincatcher-demo-cloud.png)](https://travis-ci.org/feedhenry-raincatcher/raincatcher-demo-cloud)

> *Note:* This repository is no longer used. All active development was moved to new [raincatcher-core](https://github.com/feedhenry-raincatcher/raincatcher-core) repository.

This is a reference/demo implementation of the cloud application of a RainCatcher project.  


This repository should be used in conjunction with these following repos :

- [Portal Demo App](https://github.com/feedhenry-raincatcher/raincatcher-demo-portal)
- [Mobile Client Demo App](https://github.com/feedhenry-raincatcher/raincatcher-demo-mobile)
- [RainCatcher Auth Service](https://github.com/feedhenry-raincatcher/raincatcher-demo-auth)

## Prerequisites (local)

- mongodb installed and running on port 27017.
- redis installed and running on port 6379

## Setup (locally)

`npm install`

## Starting (locally)

`grunt`

## Troubleshooting nodemon (part of `grunt serve`)

If you get an error like `Error: watch ENOSPC`, fix it with `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

## Running The Demo Solution Locally

The [Running The Demo Raincatcher Solution Locally](https://github.com/feedhenry-raincatcher/raincatcher-documentation/blob/master/running-locally.adoc) guide explains how to get the Raincatcher demo solution running on your local development machine. This is targeted at developers that wish to extend the existing functionality of Raincatcher modules and demo apps.
