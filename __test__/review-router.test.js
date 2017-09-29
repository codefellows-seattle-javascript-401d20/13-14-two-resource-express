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

  describe('POST /reviews/id', () => {
    test('should return 200 and a review', () => {
      // let tempMock;
      // return bookMock.create()
      // .then(mock  => {
      //   tempMock = mock;
      //   return superagent.post(`${apiURL}/reviews`)
      //   .send({
      //     title: 'Best Book!!!',
      //     author: 'Katherine H',
      //     content: 'This book has the best characters, dialogue, and plot, A+++',
      //     book: mock._id,
      //   });
      // })
      // .then(res => {
      //   console.log(res.body);
      //   expect(res.status).toEqual(200);
      //   expect(res.body._id).toBeTruthy();
      //   expect(res.body.timestamp).toBeTruthy();
      //   expect(res.body.book).toEqual(tempMock._id.toString());
      //   expect(res.body.title).toEqual('Best Book!!!');
      //   expect(res.body.author).toEqual('Katherine H');
      //   expect(res.body.content).toEqual('This book has the best characters and plot, A+');
      // });
    });

    test('should return 404 ', () => {
      // return superagent.post(`${apiURL}/reviews`)
      // .send({
      //   title: 'Worst Book!!!',
      //   content: 'This book has the worst characters and plot, would give it a Z if I could',
      // })
      // .then(Promise.reject)
      // .catch(res => {
      //   expect(res.status).toEqual(404);
      // });
    });
  });

  describe('GET /reviews/:id', () => {
    test('should return 200 and a review', () => {
      // let tempMock;
      // return reviewMock.create()
      // .then(mock  => {
      //   tempMock = mock;
      //   return superagent.get(`${apiURL}/reviews/${mock.review._id}`);
      // })
      // .then(res => {
      //   console.log(res.body);
      //   expect(res.status).toEqual(200);
      //   expect(res.body._id).toEqual(tempMock.review._id.toString());
      //   expect(res.body.title).toEqual(tempMock.review.title);
      //   expect(res.body.content).toEqual(tempMock.review.content);
      //   expect(res.body.timestamp).toEqual(tempMock.review.timestamp.toJSON());
      //   expect(res.body.book._id).toEqual(tempMock.book._id.toString());
      //   expect(res.body.book.title).toEqual(tempMock.book.title);
      //   expect(res.body.book.author).toEqual(tempMock.book.author);
      //   expect(JSON.stringify(res.body.book.keywords))
      //     .toEqual(JSON.stringify(tempMock.book.keywords));
      // });
    });
  });
});
