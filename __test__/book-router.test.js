'use strict';

// mock the env
require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const bookMock = require('./lib/book-mock.js');
const faker = require('faker');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/books', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(bookMock.remove);

  describe('POST /books', () => {
    test('should respond with a book and 200 status', () => {
      let tempBook = {
        title: faker.lorem.words(10),
        author: faker.name.findName(),
        description: faker.lorem.words(100),
        keywords: [faker.lorem.words(1), faker.lorem.words(1)],
      };
      return superagent.post(`${apiURL}/books`)
        .send(tempBook)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.title).toEqual(tempBook.title);
          expect(res.body.author).toEqual(tempBook.author);
          expect(res.body.description).toEqual(tempBook.description);
          expect(res.body.keywords).toEqual(tempBook.keywords);
        });
    });

    // POST: test 409, it should respond with 'conflict'
    // if a request is made for a duplicate of a unique key
    test('should respond with a 409 status', () => {
      return bookMock.create()
      .then(book => {
        return superagent.post(`${apiURL}/books`)
        .send({
          title: book.title,
          author: book.author,
          description: book.description,
          keywords: [],
        });
      })
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(409);
      });
    });

    test('should respond with a 400 status due to lack of title', () => {
      return superagent.post(`${apiURL}/books`)
        .send({})
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('should respond with a 400 status due to bad json', () => {
      return superagent.post(`${apiURL}/books`)
        .set('Content-Type', 'application/json')
        .send('}')
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('GET /api/books/:id', () => {
    describe('GET /books/:id', () => {
      test('should respond with a book and 200 status', () => {
        let tempBook;
        return bookMock.create()
        .then(book => {
          tempBook = book;
          return superagent.get(`${apiURL}/books/${book._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempBook._id.toString());
          expect(res.body.title).toEqual(tempBook.title);
          expect(res.body.author).toEqual(tempBook.author);
          expect(res.body.description).toEqual(tempBook.description);
          expect(JSON.stringify(res.body.keywords)).toEqual(JSON.stringify(tempBook.keywords));
        });
      });
    });

    test('should respond with 404 status', () => {
      return superagent.get(`${apiURL}/api/books/hihihi`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('GET /api/books', () => {
    test('should return 100 books', () => {
      return bookMock.createMany(1000)
        .then(tempBooks => {
          return superagent.get(`${apiURL}/api/books`);
        })
        .then(res => {
          console.log(res.headers);
          expect(res.status).toEqual(200);
          expect(res.body.count).toEqual(1000);
          expect(res.body.data.length).toEqual(100);
        });
    });
  });

  describe('PUT /books/:id', () => {
    test('should respond with a 200 status', () => {
      let tempBook = {
        title: faker.lorem.words(10),
        author: faker.name.findName(),
        description: faker.lorem.words(100),
        keywords: [faker.lorem.words(1), faker.lorem.words(1)],
      };
      return bookMock.create()
      .then(book => {
        return superagent.put(`${apiURL}/books/${book._id}`)
        .send(tempBook);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body.title).toEqual(tempBook.title);
        expect(res.body.author).toEqual(tempBook.author);
        expect(res.body.description).toEqual(tempBook.description);
        expect(res.body.keywords).toEqual(tempBook.keywords);
      });
    });

    test('should respond with 404 status', () => {
      let thisBook = {
        title: faker.lorem.words(10),
        author: faker.name.findName(),
        description: faker.lorem.words(100),
        keywords: [faker.lorem.words(1), faker.lorem.words(1)],
      };
      return superagent.put(`${apiURL}/books/hahaha`)
        .send(thisBook)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

    // PUT: test 400, it should respond with 'bad request'
    // if no request body was provided or the body was invalid
    test('should respond with a 400 status due to lack of title', () => {
      let tempBook = {
        author: faker.name.findName(),
        description: faker.lorem.words(100),
        keywords: [faker.lorem.words(1), faker.lorem.words(1)],
      };
      return bookMock.create()
      .then(book => {
        return superagent.put(`${apiURL}/books/${book._id}`)
        .send(tempBook)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
      });
    });

    // PUT: test 409, it should respond with 'conflict'
    // if a request is made for a duplicate of a unique key
    // test('should respond with a 409 status', () => {
    //   return bookMock.create()
    //   .then(book => {
    //     return superagent.put(`${apiURL}/books/${book._id}`)
    //     .send({
    //       title: book.title,
    //       author: book.author,
    //       description: book.description,
    //       keywords: [],
    //     });
    //   })
    //   .then(Promise.reject)
    //   .catch(res => {
    //     expect(res.status).toEqual(409);
    //   });
    // });
  });

  describe('DELETE /books/:id', () => {
    test('should respond with a 204', () => {
      let tempBook;
      return bookMock.create()
      .then(book => {
        tempBook = book;
        return superagent.delete(`${apiURL}/books/${book._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(204);
      });
    });

    test('should respond with a 404', () => {
      return superagent.delete(`${apiURL}/api/books/hahaha`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
});
