const faker = require('faker');
const Book = require('../../model/book.js');


let bookMockCreate = () => {
  return new Book({
    title: faker.lorem.words(7),
    author: faker.lorem.words(5).split(' '),
    genre: faker.lorem.words(6),
    chapterContent: faker.lorem.words(20),
  }).save();
};

let bookMockCreateMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => bookMockCreate()));
};

let remove = () => Book.remove({});

module.exports = (bookMockCreate, bookMockCreateMany, remove);
