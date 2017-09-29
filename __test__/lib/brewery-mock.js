'use strict';

const faker = require('faker');
const Brewery = require('../../model/brewery.js');

let create = () => {
  return new Brewery({
    breweryname: faker.lorem.words(7),
    location: faker.lorem.words(5),
  }).save();
};

let createMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => create()));
};

let remove = () => Brewery.remove({});

module.exports = {create, createMany, remove};
