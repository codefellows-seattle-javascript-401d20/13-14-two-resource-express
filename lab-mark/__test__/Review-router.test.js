'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const reviewMock = require('./lib/review-mock.js');
const videogameMock = require('./lib/videogame-mock.js');
const faker = require('faker');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/reviews', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(reviewMock.remove);

  describe('GET api/reviews', () => {
    test('should return 200 and a review', () => {
      let tempMock;
      return reviewMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/api/reviews/${mock.review._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempMock.review._id.toString());
          expect(res.body.content).toEqual(tempMock.review.content);
          expect(res.body.videogame._id).toEqual(tempMock.videogame._id.toString());
          expect(res.body.videogame.title).toEqual(tempMock.videogame.title);
          expect(res.body.videogame.genre).toEqual(tempMock.videogame.genre);
          expect(res.body.videogame.console).toEqual(tempMock.videogame.console);
        });
    });
  });

  describe('POST /api/videogames', () => {
    test('should respond with a review and 200 status', () => {
      let tempReview = {
        content: faker.lorem.words(30),
      };
      return videogameMock.create()
        .then(mock => {
          tempReview.videogame = mock._id;
          return superagent.post(`${apiURL}/api/reviews`)
            .send(tempReview);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.videogame).toEqual(tempReview.videogame.toString());
          expect(res.body.content).toEqual(tempReview.content);
        });
    });
  });

  describe('DELETE /api/videogames', () => {
    test('should respond with a 204 status', () => {
      return reviewMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/api/reviews/${mock.review._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });
  });

  describe('PUT /api/videogames', () => {
    test('should respond with a 200 status', () => {
      let tempReview = {
        content: 'Hello hello hello!',
      };
      return reviewMock.create()
        .then(mock => {
          tempReview.videogame = mock.videogame._id;
          return superagent.put(`${apiURL}/api/reviews/${mock.review._id}`)
            .send(tempReview);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.content).toEqual(tempReview.content);
        });
    });
  });
});
