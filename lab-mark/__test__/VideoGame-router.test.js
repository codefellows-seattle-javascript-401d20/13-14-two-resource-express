'use strict';

// mock the env
require('./lib/setup.js');

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server.js');
const videogameMock = require('./lib/videogame-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/api/videogames', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(videogameMock.remove);

  describe('POST /api/videogames', () => {
    test('should respond with a videogame and 200 status', () => {
      let tempVideoGame = {
        title: faker.lorem.words(10),
        genre: faker.lorem.words(10),
        console: faker.lorem.words(10),
      };
      return superagent.post(`${apiURL}/api/videogames`)
        .send(tempVideoGame)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual(tempVideoGame.title);
          expect(res.body.console).toEqual(tempVideoGame.console);
          expect(res.body.genre).toEqual(tempVideoGame.genre);
        });
    });

    test('should respond with a 400 status', () => {
      let mockVideoGame = {
        genre: faker.lorem.words(10),
        console: faker.lorem.words(10),
      };
      return superagent.post(`${apiURL}/api/videogames`)
        .send(mockVideoGame)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('GET /api/videogames', () => {
    test('should respond with a videogame and 200 status', () => {
      let tempVideoGame;
      return videogameMock.create()
        .then(videogame => {
          tempVideoGame = videogame;
          return superagent.get(`${apiURL}/api/videogames/${videogame._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempVideoGame._id.toString());
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual(tempVideoGame.title);
          expect(res.body.console).toEqual(tempVideoGame.console);
          expect(res.body.genre).toEqual(tempVideoGame.genre);
        });
    });

    test('should respond with an array of all videogames and 200 status', () => {
      return videogameMock.createMany(100)
        .then(() => {
          return superagent.get(`${apiURL}/api/videogames`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.count).toEqual(100);
          expect(res.body.data.length).toEqual(10);
        });
    });

    test('should respond with 404 status', () => {
      return superagent.get(`${apiURL}/api/videogames/helloworld`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/videogames', () => {
    test('should respond with a 204 status', () => {
      return videogameMock.create()
        .then(videogame => {
          return superagent.delete(`${apiURL}/api/videogames/${videogame._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });

    test('should respond with 404 status', () => {
      return superagent.delete(`${apiURL}/api/videogames/helloworld`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

    test('should respond with 400 status', () => {
      return superagent.delete(`${apiURL}/api/videogames/`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('PUT /api/videogames', () => {
    test('should respond with a 200 status', () => {
      let tempVideoGame = {
        title: faker.lorem.words(10),
        genre: faker.lorem.words(10),
        console: faker.lorem.words(10),
      };
      return videogameMock.create()
        .then(videogame => {
          return superagent.put(`${apiURL}/api/videogames/${videogame._id}`)
            .send(tempVideoGame);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.title).toEqual(tempVideoGame.title);
          expect(res.body.console).toEqual(tempVideoGame.console);
          expect(res.body.genre).toEqual(tempVideoGame.genre);
        });
    });

    test('should respond with 404 status', () => {
      let tempVideoGame = {
        title: faker.lorem.words(10),
        genre: faker.lorem.words(10),
        console: faker.lorem.words(10),
      };
      return superagent.put(`${apiURL}/api/videogames/helloworld`)
        .send(tempVideoGame)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

    test('should respond with 400 status', () => {
      let tempVideoGame = {
        title: faker.lorem.words(10),
        genre: faker.lorem.words(10),
        console: faker.lorem.words(10),
      };
      return superagent.delete(`${apiURL}/api/videogames/`)
        .send(tempVideoGame)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });
});
