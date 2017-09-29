'use strict';

const faker = require('faker');
const User = require('../../model/user.js');

let create = () => {
  return new User({
    username: faker.internet.userName(),
    password: faker.internet.password(),
    fullname: faker.name.findName() + ' ' + faker.name.lastName(),
    email: faker.internet.email(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    about: faker.lorem.words(20),
  }).save();
};

let createMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => create()));
};

let remove = () => User.remove({});

module.exports = { create, createMany, remove };

