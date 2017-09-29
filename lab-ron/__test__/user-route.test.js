'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const userMock = require('./lib/user-mock');

let apiURL = `http://localhost:${process.env.PORT}`;

describe('/users/', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(userMock.remove);

  describe('POST /users', () => {
    test('200 OK', () => { });
    
    test('409 due to duplicate username', () => { });
    test('400 due to lack of username', () => { });
    test('400 due to lack of password', () => { });
    test('400 due to lack of email', () => { });
    test('400 due to lack of fullname', () => { });
    test('400 due to bad json', () => { });
  });

});