'use strict';

const faker = require('faker');
const Book = require('../../model/book.js');

let create = () => {
  return new Book({
    title: faker.lorem.words(10),
    author: faker.name.findName(),
    description: faker.lorem.words(100),
    keywords: [faker.lorem.words(1), faker.lorem.words(1)],
  }).save();
};

let createMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => create()));
};

let remove = () => Book.remove({});

module.exports = {create, createMany, remove};
