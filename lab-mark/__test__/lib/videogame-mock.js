'use strict';

const faker = require('faker');
const VideoGame = require('../../model/VideoGame.js');

let create = () => {
  return new VideoGame({
    title: faker.lorem.words(10),
    genre: faker.lorem.words(1),
    console: faker.lorem.words(1),
  }).save();
};

let createMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => create()));
};

let remove = () => VideoGame.remove({});

module.exports = {create, createMany, remove};
