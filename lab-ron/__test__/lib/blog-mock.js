'use strict';

const faker = require('faker');
const userMock = require('./user-mock.js');
const Blog = require('../../model/blog.js');

let create = () => {
  let result = {};
  return userMock.create()
    .then(user => {
      result.user = user;
      return new Blog({
        title: faker.lorem.words(Math.ceil(Math.random() * 20) + 5),
        body:  faker.lorem.words(Math.ceil(Math.random() * 200) + 5),
        isPublished: Math.random() > .5 ? true : false,
        user: user._id,
      }).save();
    })
    .then(blog => {

      result.blog = blog;
      return result;
    });
};

let createMany = (num) => {
  let result = {};
  return userMock.create()
    .then(user => {
      result.user = user;
      return Promise.all(new Array(num).fill(0)
        .map(() => {
          return new Blog({
            content: faker.lorem.words(7),
            user: user._id,
          }).save();
        }));
    })
    .then(blogs => {
      result.blogs = blogs;
      return result;
    });
};

let remove = () => Promise.all([
  Blog.remove({}),
  userMock.remove(),
]);

module.exports = { create, createMany, remove };