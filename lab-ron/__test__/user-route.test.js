'use strict';

process.env.PORT = 7000;
process.env.CORS_ORIGIN = 'http://localhost:8080';
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server.js');
const User = require('../model/user.js');

let apiURL = `http://localhost:${process.env.PORT}`;

let userMockCreate = () => {
  return new User({
    username: faker.internet.userName(),
    password: faker.internet.password(),
    fullname: faker.name.findName() + ' ' + faker.name.lastName(),
    email: faker.internet.email(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    about: faker.lorem.words(Math.ceil(Math.random() * 50) + 10),
  }).save();
};

let userMockCreateMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => userMockCreate()));
};

describe('/users/', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => User.remove({}));




});