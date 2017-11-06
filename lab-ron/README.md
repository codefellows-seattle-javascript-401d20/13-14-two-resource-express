# Blog application

## About

This is a blog application api to serve blog post from multiple authors

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

# Api

## /USERS

### POST /users
Takes in a json object with a require `username`, `email`, `fullname`, `password` and optional `city`, `state`, and `about` and returns a new user

*e.g*
`localhost:3000/users`
```
// returns
{
  username: 'johndoe',    // required
  email: 'john@doe.com',  // required
  fullname: 'John Doe',   // required
  password: 'doeisRad',   // required
  city: 'Seattle',
  state: 'WA',
  about: 'I am rad'
}
```

### GET /users/:id
Takes in an `/user/id` and returns the user based on the id

*e.g*
`localhost:3000/users:39ajj38984`
```
{
  _id:'39ajj38984',
  username: 'johndoe' ,   // required
  email: 'john@doe.com', // required
  fullname: 'John Doe',   // required
  password: 'doeisRad',  // required
  city: 'Seattle',
  state: 'WA',
  about: 'I am rad'
}
```


### PUT /users/:id
Takes in an `/user/id` and a json object and returns the updated user
*e.g*
`localhost:3000/users/39ajj38984`
```
{
  city: 'New York',
  stat: 'NY'
}
```

```
{
  _id:39ajj38984
  username: 'johndoe'    // required
  email: 'john@doe.com'  // required
  fullname: 'John Doe'   // required
  password: 'doeIsRad'   // required
  city: 'Seattle'
  city: 'New York',
  stat: 'NY'
}
```

### DELETE /users
Takes in a `/user/id`, removes the user and returns a 204 status

*e.g*
`localhost:3000/users/39ajj38984`

`// DELETES USER`

### BLOGS

### POST /blogs
Takes in a `/blogs` and a `json object` with a `userID` returns a blog for the `/blogs`

*e.g*
`localhost:3000/blogs/`

```
{
  user: '39ajj38984'
  body: 'this is the body',
  isPublished: false
}
```
returns
```
{
	"_id" : 59fe38001d,
	"title" : "Hello World",
	"user" : _id(39ajj38984),
	"timestamp" : ISODate("2017-11-04T21:58:24.486Z"),
	"body" : "this is the body",
  "isPublished": false
	"__v" : 0
}
```

### GET /blogs/id
Takes the `/blogs/id` and returns the blog

*e.g*
`localhost:3000/blogs/59fe38001d`

```
{
	"_id" : 59fe38001d,
	"title" : "Hello World",
	"user" : _id(39ajj38984),
	"timestamp" : ISODate("2017-11-04T21:58:24.486Z"),
	"body" : "this is the body",
  "isPublished": true
	"__v" : 0
}
```


### PUT /blogs/id

Takes in a `/blogs/id` and `json object` returns the updated blog

*e.g*
`localhost:3000/blogs/59fe38001d`

```
{
  body: 'this is the new body',
  isPublished: true
}
```
returns
```
{
	"_id" : 59fe38001d,
	"title" : "Hello World",
	"user" : _id(39ajj38984),
	"timestamp" : ISODate("2017-11-04T21:58:24.486Z"),
	"body" : "this is the new body",
  "isPublished": true
	"__v" : 0
}
```

### DELETE /blogs

Takes in a `/blogs/id`, removes the blog and returns a 204 status

*e.g*
`localhost:3000/blog/39ajj38984`

`// DELETES BLOG`
