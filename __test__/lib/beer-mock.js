'use strict';

const faker = require('faker');
const breweryMock = require('./brewery-mock.js');
const Beer = require('../../model/beer.js');

let create = () => {
  let result = {};
  return breweryMock.create()
  .then(brewery => {
    result.brewery = brewery;
    return new Beer({
      name: faker.lorem.words(8),
      beerstyle: faker.lorem.words(8),
      abv: faker.lorem.words(8),
      brewery: brewery._id,
    }).save();
  })
  .then(beer => {
    result.beer = beer;
    return result;
  });
};

let createMany = (num) => {
  let result = {};
  return breweryMock.create()
  .then(brewery => {
    result.brewery = brewery;
    return Promise.all(new Array(num).fuill(0)
    .map(() => {
      return new Beer({
        name: faker.lorem.words(8),
        beerstyle: faker.lorem.words(8),
      }).save();
    }));
  })
  .then(beers => {
    result.beers = beers;
    return result;
  });
};

let remove = () => Promise.all([
  Beer.remove({}),
  breweryMock.remove(),
]);

module.exports = {create, createMany, remove};
