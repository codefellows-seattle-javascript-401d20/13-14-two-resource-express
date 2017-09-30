'use strict';

process.env.PORT = 4000;
process.env.CORS_ORIGIN = 'http://localhost:8080';
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const superagent = require('superagent');
const server = require('../lib/server.js');
const Book = require('../model/book.js');

let apiURL = `http://localhost:${process.env.PORT}`;

describe('/books', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Book.remove({}));

  describe('POST /books', () => {
    test('200', () => {
      return superagent.post(`${apiURL}/books`)
        .send({
          title: 'Enders Game',
          author: 'Orson Scott Card',
          genre: 'Sci-Fi',
          chapterContent: 'death to the buggers!',
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual('Enders Game');
          expect(res.body.author).toEqual('Orson Scott Card');
          expect(res.body.genre).toEqual('Sci-Fi');
          expect(res.body.chapterContent).toEqual('death to the buggers!');
        });
    });

    test('409 due to lack duplicate title', () => {
      return bookMockCreate()
        .then(book => {
          return superagent.post(`${apiURL}/books`)
            .send({
              title: book.title,
              author: book.author,
            });
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(409);
        });
    });
    test('409 due to lack duplicate author', () => {
      return bookMockCreate()
        .then(book => {
          return superagent.post(`${apiURL}/books`)
            .send({
              title: book.title,
              author: book.author,
            });
        })
        .then(Promise.reject)
        .catch(res => {
          //409 is a conflict in the request
          expect(res.status).toEqual(409);
        });
    });

    test('400 due to lack of title', () => {
      return bookMockCreate()
        .then(book => {
          return superagent.post(`${apiURL}/books`)
            .send({
              author: book.author,
              genre: book.genre,
            })
            .then(Promise.reject);
        })
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
    test('400 due to lack of author', () => {
      return bookMockCreate()
        .then(book => {
          return superagent.post(`${apiURL}/books`)
            .send({
              genre: book.genre,
            })
            .then(Promise.reject);
        })
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
    test('400 due to lack of genre', () => {
      return superagent.post(`${apiURL}/books`)
      //lack of genre means lack of all books
        .send({      })
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
              title: 'Enders Game',
              author: 'Orson Scott Card',
              content: 'death to the buggers!',
            });
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempBook._id.toString());
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual('Enders Game');
          expect(res.body.author).toEqual('Orson Scott Card');
          expect(res.body.genre).toEqual('Sci-Fi');
          expect(res.body.content).toEqual('death to the buggers!');
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
          //'ok', but in a GET request, the response will contain
          //an entity corresponding to the requested resource
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempBook._id.toString());
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual(tempBook.title);
          expect(res.body.author).toEqual(tempBook.author);
          expect(res.body.genre).toEqual(tempBook.genre);
          //need to research following line until understood fully
          // expect(JSON.stringify(res.body.content)).toEqual(JSON.stringify(tempBook.content));
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
