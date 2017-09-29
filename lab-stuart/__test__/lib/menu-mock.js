'use strict';

const faker = require('faker');
const Menu = require('../../model/menu.js');

let create = () => {
  return new Menu({
    title: faker.lorem.words(4),
    category: faker.lorem.words(4),
  }).save();
}

let createMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => create()));
}

let remove = () => Menu.remove({});

module.exports = {create, createMany, remove}
