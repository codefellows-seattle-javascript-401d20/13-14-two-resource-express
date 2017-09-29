'use strict';

require('./lib/setup.js');

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server.js');
const userMock = require('./lib/user-mock');

let apiURL = `http://localhost:${process.env.PORT}`;

describe('/users/', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(userMock.remove);

  describe('POST /users', () => {
    test('200 Success', () => {
      let tempUser = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        fullname: faker.name.findName() + ' ' + faker.name.lastName(),
        email: faker.internet.email(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        about: faker.lorem.words(20),
      };
      return superagent.post(`${apiURL}/users`)
        .send(tempUser)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.username).toEqual(tempUser.username);
          expect(res.body.password).toEqual(tempUser.password);
          expect(res.body.email).toEqual(tempUser.email);
          expect(res.body.city).toEqual(tempUser.city);
          expect(res.body.state).toEqual(tempUser.state);
          expect(res.body.about).toEqual(tempUser.about);
        });
    });

    test('409 due to duplicate username', () => {
      return userMock.create()
        .then(user => {
          return superagent.post(`${apiURL}/users`)
            .send({
              username: user.username,
              password: faker.internet.password(),
              fullname: faker.name.findName() + ' ' + faker.name.lastName(),
              email: faker.internet.email(),
            });
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(409);
        });

    });

    test('400 due to lack of username', () => {
      return superagent.post(`${apiURL}/users`)
        .send({})
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('400 due to lack of password', () => {
      return superagent.post(`${apiURL}/users`)
        .send({})
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('400 due to lack of email', () => {
      return superagent.post(`${apiURL}/users`)
        .send({})
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('400 due to lack of fullname', () => {
      return superagent.post(`${apiURL}/users`)
        .send({})
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('400 due to bad json', () => {
      return superagent.post(`${apiURL}/users`)
        .set('Content-Type', 'application/json')
        .send('{')
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('PUT /users/:id', () => {
    test('200 Success', () => {
      let tempUser;
      return userMock.create()
        .then(user => {
          tempUser = user;
          return superagent.put(`${apiURL}/users/${user._id}`)
            .send({
              username: 'myNewUserName',
              email: 'new@email.com',
            });
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempUser._id.toString());
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.username).toEqual('myNewUserName');
          expect(res.body.email).toEqual('new@email.com');
        });
    });

    test('404 user not found', () => {
      return superagent.put(`${apiURL}/users/badpath`)
        .send({
          username: 'myNewUserName',
          email: 'new@email.com',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('GET /users/:id', () => {
    test('200 Success', () => {
      let tempUser;
      return userMock.create()
        .then(user => {
          tempUser = user;
          return superagent.get(`${apiURL}/users/${user._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempUser._id.toString());
          expect(res.body.timestamp).toBeTruthy();
          expect(res.body.username).toEqual(tempUser.username);
          expect(res.body.password).toEqual(tempUser.password);
          expect(res.body.email).toEqual(tempUser.email);
          expect(res.body.city).toEqual(tempUser.city);
          expect(res.body.state).toEqual(tempUser.state);
          expect(res.body.about).toEqual(tempUser.about);
        });
    });

    test('404 user not found', () => {
      return superagent.get(`${apiURL}/users/badpath`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('DELETE /users/:id', () => {
    test('204 Success', () => {
      return userMock.create()
        .then(user => superagent.delete(`${apiURL}/users/${user._id}`))
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });

    test('404 user not found', () => {
      return superagent.delete(`${apiURL}/users/badpath`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
  
});
