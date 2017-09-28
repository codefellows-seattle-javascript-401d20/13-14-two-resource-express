# Blog application

## About

This is a blog application api to serve blog post from multiple authors

Email
Username
Password
Author Name

Title 
Content
Date Published
Date Modified
Tags
Comments


## Set up

This application requires **NodeJS** and **MongoDB**. If you don't have them, please click below to download them:

- [Download NodeJS](https://nodejs.org)
- [Download MongoDB](https://www.mongodb.com/download-center#community)


### Dependencies

The `package.json` already contain most of the dependencies needed to run your application. 
Make sure to install them by running `npm i`.

### Environment Variables

The application also requires some environment variables to run. You will need a port number, a path to the mongo url url, and a cors variable

There are a couple of way of going about it. 
1. Set the variables using the terminal window by using the following commands:

```
export PORT=3000
export MONGODB_URI=mongodb://localhost/dev
```
> *NOTE:* These variable will live until the terminal window is closed.

2. Create a `.env` file to hold your variables.
```
PORT=3000
MONGODB_URI=mongodb://localhost/dev
```
> *NOTE:* Always remember to keep your environment variables safe. Never put your environment variable on your git repository.

### Starting and Stopping the Server

To start the database and server, run the following command `npm run dbon && npm run start`.
To stop the database run `npm run dboff`.

## Api

API