'use strict';

const faker = require('faker');
const bookMock = require('./book-mock.js');
const Chapter = require('../../model/chapter.js');

let create = () => {
  let result = {};
  return bookMock.create()
    .then(book => {
      result.book = book;
      return new Chapter({
        content: faker.lorem.words(16),
        book: book._id,
      }).save();
    }).then(chapter => {
      result.chapter = chapter;
      return result;
    });
};

let createMany = (amount) => {
  let result = {};
  return bookMock.create()
    .then(book => {
      result.book = book;
      return Promise.all(new Array(amount).fill(0)
        .map(() => {
          return new Chapter({
            content: faker.lorem.words(16),
            book: book._id,
          }).save();
        }));
    }).then(chapter => {
      result.chapter = chapter;
      return result;
    });
};

//ask about ({}) vs ()
let remove = () => Promise.all([
  Chapter.remove({}),
  bookMock.remove(),
]);
module.exports = (create, createMany, remove);
