'use strict';

// mock the env
process.env.PORT = 4000;
process.env.CORS_ORIGIN = 'http://localhost:8080';
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server.js');
const Book = require('../model/book.js');

let apiURL = `http://localhost:${process.env.PORT}`;

let bookMockCreate = () => {
  return new Book({
    title: faker.lorem.words(7),
    keywords: faker.lorem.words(5).split(' '),
  }).save();
};

let bookMockCreateMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => bookMockCreate()));
};

describe('/books', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Book.remove({}));

  describe('POST /books', () => {
    test('200', () => {
      return superagent.post(`${apiURL}/books`)
        .send({
          title: 'shark in the dark',
          keywords: ['cool', 'beans'],
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual('shark in the dark');
          expect(res.body.keywords).toEqual(['cool', 'beans']);
        });
    });

    test('409 due to lack duplicate title', () => {
      return bookMockCreate()
        .then(book => {
          return superagent.post(`${apiURL}/books`)
            .send({
              title: book.title,
              keywords: [],
            });
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(409);
        });
    });

    test('400 due to lack of title', () => {
      return superagent.post(`${apiURL}/books`)
        .send({})
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('400 due to bad json', () => {
      return superagent.post(`${apiURL}/books`)
        .set('Content-Type', 'application/json')
        .send('{')
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('PUT /books/:id', () => {
    test('200', () => {
      let tempBook;
      return bookMockCreate()
        .then(book => {
          tempBook = book;
          return superagent.put(`${apiURL}/books/${book._id}`)
            .send({
              title: 'shark in the dark',
              keywords: ['cool', 'beans'],
            });
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempBook._id.toString());
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual('shark in the dark');
          expect(res.body.keywords).toEqual(['cool', 'beans']);
        });
    });
  });

  describe('GET /books/:id', () => {
    test('200', () => {
      let tempBook;
      return bookMockCreate()
        .then(book => {
          tempBook = book;
          return superagent.get(`${apiURL}/books/${book._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempBook._id.toString());
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual(tempBook.title);
          expect(JSON.stringify(res.body.keywords)).toEqual(JSON.stringify(tempBook.keywords));
        });
    });
  });

  describe('DELETE /books/:id', () => {
    test('200', () => {
      let tempBook;
      return bookMockCreate()
        .then(book => {
          tempBook = book;
          return superagent.delete(`${apiURL}/books/${book._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });
  });


});
