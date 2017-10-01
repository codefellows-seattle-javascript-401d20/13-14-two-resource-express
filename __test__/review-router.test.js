'use strict';


require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const reviewMock = require('./lib/review-mock.js');
const bookMock = require('./lib/book-mock.js');

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
      return superagent.get(`${apiURL}/api/books/hihihi`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });


  describe('DELETE /reviews/:id', () => {
    // test('should return 200', () => {
    //   let tempBook;
    //   return bookMock.create()
    //   .then(book => {
    //     tempBook = book;
    //     return superagent.delete(`${apiURL}/books/${book._id}`);
    //   })
    //   .then(res => {
    //     expect(res.status).toEqual(204);
    //   });
    // });
  });
});
