'use strict';

const faker = require('faker');
const bookMock = require('./book-mock.js');
const Review = require('../../model/review.js');

let create = () => {
  let result = {};
  return bookMock.create()
  .then(book => {
    result.book = book;
    return new Review({
      title: faker.lorem.words(10),
      author: faker.name.findName(),
      content: faker.lorem.words(100),
      book: book._id,
    }).save();
  })
  .then(review => {
    result.review = review;
    return result;
  });
};

let createMany = (num) => {
  let result = {};
  return bookMock.create()
  .then(book => {
    result.book = book;
    return Promise.all(new Array(num).fill(0)
    .map(() => {
      return new Review({
        title: faker.lorem.words(10),
        author: faker.name.findName(),
        content: faker.lorem.words(100),
        book: book._id,
      }).save();
    }));
  })
  .then(reviews => {
    result.reviews = reviews;
    return result;
  });
};

let remove = () => Promise.all([
  Review.remove({}),
  bookMock.remove(),
]);

module.exports = {create, createMany, remove};
