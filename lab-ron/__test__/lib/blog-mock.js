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

      });
    });
};
let createMany = (num) => { };
let remove = () => { };


module.exports = { create, createMany, remove };