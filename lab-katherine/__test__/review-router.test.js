'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const reviewMock = require('./lib/review-mock.js');
const bookMock = require('./lib/book-mock.js');
const faker = require('faker');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/reviews', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(reviewMock.remove);

  describe('POST /reviews/:id', () => {
    test('should return 200 and a review', () => {
      let tempMock;
      return bookMock.create()
        .then(mock  => {
          tempMock = mock;
          return superagent.post(`${apiURL}/reviews`)
            .send({
              title: 'Amazing book!',
              author: 'Jane A',
              content: 'Amazing book! I could not put it down, read it in one sitting.',
              book: mock._id,
            });
        })
        .then(res => {
          console.log(res.body);
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.book).toEqual(tempMock._id.toString());
          expect(res.body.content).toEqual('Amazing book! I could not put it down, read it in one sitting.');
        });
    });

    test('should respond with a 400 status due to lack of title', () => {
      return superagent.post(`${apiURL}/reviews`)
        .send({})
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('should respond with a 400 status due to bad json', () => {
      return superagent.post(`${apiURL}/reviews`)
        .set('Content-Type', 'application/json')
        .send('}')
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('should respond with a 409 status due to a duplicate of a unique key', () => {
      return bookMock.create()
        .then(mock  => {
          return superagent.post(`${apiURL}/reviews`)
            .send({
              title: 'Worst book!',
              author: 'Best Critic!',
              content: 'I hated this book so much, my cries of anguish while reading it scared my dog.',
              book: mock._id,
            })
            .then(() => {
              return superagent.post(`${apiURL}/reviews`)
                .send({
                  title: 'Worst book!',
                  author: 'Best Critic!',
                  content: 'I hated this book so much, my cries of anguish while reading it scared my dog.',
                  book: mock._id,
                });
            })
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(409);
            });
        });
    });
  });

  describe('GET /reviews/:id', () => {
    test('should return 200 and a review', () => {
      let tempMock;
      return reviewMock.create()
        .then(mock  => {
          tempMock = mock;
          return superagent.get(`${apiURL}/reviews/${mock.review._id}`);
        })
        .then(res => {
          console.log(res.body);
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempMock.review._id.toString());
          expect(res.body.content).toEqual(tempMock.review.content);
          expect(res.body.timestamp).toEqual(tempMock.review.timestamp.toJSON());
          expect(res.body.book._id).toEqual(tempMock.book._id.toString());
          expect(res.body.book.title).toEqual(tempMock.book.title);
          expect(res.body.book.author).toEqual(tempMock.book.author);
          expect(JSON.stringify(res.body.book.keywords))
            .toEqual(JSON.stringify(tempMock.book.keywords));
        });
    });

    test('should respond with 404 status', () => {
      return superagent.get(`${apiURL}/reviews/hihihi`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('DELETE /reviews/:id', () => {
    test('should return 204', () => {
      return reviewMock.create()
        .then(mock  => {
          return superagent.delete(`${apiURL}/reviews/${mock.review._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });

    test('should respond with a 404', () => {
      return superagent.delete(`${apiURL}/reviews/hahaha`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
});
