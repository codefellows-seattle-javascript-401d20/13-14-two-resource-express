'use strict';

process.env.PORT = 7000;
process.env.CORS_ORIGIN = 'http://localhost:8080';
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server.js');
const Sandwich = require('../model/sandwich.js');

let apiURL = `http://localhost:${process.env.PORT}`;

let sandwichMockCreate = () => {
  return new Sandwich({
    title: faker.lorem.words(10),
    bread: faker.lorem.words(5),
    cheese: faker.lorem.words(5),
    spread: faker.lorem.words(5).split(' '),
    veggies: faker.lorem.words(5).split(' '),
  }).save();
}

let sandwichMockCreateMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => sandwichMockCreate()));
}

describe('/sandwiches', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Sandwich.remove({}));

  describe('POST /sandwiches', () => {
    test('200', () => {
      return superagent.post(`${apiURL}/sandwiches`)
      .send({
        title: 'badass sammich',
        bread: 'white',
        cheese: 'sharp cheddar',
        spread: ['mayo','mustard','vinegar'],
        veggies: ['onions', 'tomatoes', 'lettuce'],
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body.title).toEqual('badass sammich');
        expect(res.body.bread).toEqual('white');
        expect(res.body.cheese).toEqual('sharp cheddar');
        expect(res.body.spread).toEqual(['mayo','mustard','vinegar']);
        expect(res.body.veggies).toEqual(['onions', 'tomatoes', 'lettuce']);
      });
    });
  });

  test('409 due to duplicate title', () => {
    return sandwichMockCreate()
    .then(sandwich => {
      return superagent.post(`${apiURL}/sandwiches`)
      .send({
        title: sandwich.title,
        bread: 'wheat',
      });
    })
    .then(Promise.reject)
    .catch(res => {
      expect(res.status).toEqual(409);
    });
  });

  test('400 due to lack of title', () => {
    return superagent.post(`${apiURL}/sandwiches`)
    .send({
      bread: 'wheat',
    })
    .then(Promise.reject)
    .catch(res => {
      expect(res.status).toEqual(400);
    });
  });

  test('400 due to lack of bread', () => {
    return superagent.post(`${apiURL}/sandwiches`)
    .send({
      title: 'baddass sammich',
    })
    .then(Promise.reject)
    .catch(res => {
      expect(res.status).toEqual(400);
    });
  });

  test('400 due to bad json', () => {
    return superagent.post(`${apiURL}/sandwiches`)
    .set('Content-Type', 'application/json')
    .send('{')
    .then(Promise.reject)
    .catch(res => {
      expect(res.status).toEqual(400);
    });
  });

});
