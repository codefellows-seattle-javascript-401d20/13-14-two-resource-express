'use strict';

const faker = require('faker');
const videogameMock = require('./videogame-mock.js');
const Review = require('../../model/Review.js');
const VideoGame = require('../../model/VideoGame.js');

let create = () => {
  let result = {};
  return videogameMock.create()
    .then(videogame => {
      result.videogame = videogame;
      return new Review({
        content: faker.lorem.words(30),
        videogame: videogame._id,
      }).save();
    })
    .then(review => {
      result.review = review;
      return result;
    });
};

let createMany = (num) => {
  let result = {};
  return videogameMock.create()
    .then(videogame => {
      result.videogame = videogame;
      return Promise.all(new Array(num).fill(0)
        .map(() => {
          return new Review({
            content: faker.lorem.words(30),
            videogame: videogame._id,
          }).save();
        })
      );
    })
    .then(reviews => {
      result.reviews = reviews;
      return result;
    });
};

let remove = () => Promise.all([
  VideoGame.remove({}),
  Review.remove({}),
]);

module.exports = {create, createMany, remove};
