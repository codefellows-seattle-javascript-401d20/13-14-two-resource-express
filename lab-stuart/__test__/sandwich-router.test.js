'use strict';

require('./lib/setup.js');

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server.js');
const sandwichMock = require('./lib/sandwich-mock.js');
const Sandwich = require('../model/sandwich.js');

let apiURL = `http://localhost:${process.env.PORT}`;

describe('/sandwiches', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Sandwich.remove({}));

  describe('GET /sandwiches/:id', () => {
    test('200', () => {
      let tempSandwich;
      return sandwichMock.create()
      .then(sandwich => {
        tempSandwich = sandwich;
        return superagent.get(`${apiURL}/sandwiches/${sandwich._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempSandwich._id.toString());
        expect(res.body.title).toEqual(tempSandwich.title);
        expect(res.body.bread).toEqual(tempSandwich.bread);
        expect(res.body.cheese).toEqual(tempSandwich.cheese);
        expect(JSON.stringify(res.body.spread)).toEqual(JSON.stringify(tempSandwich.spread));
        expect(JSON.stringify(res.body.veggies)).toEqual(JSON.stringify(tempSandwich.veggies));
      });
    });
  });

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
    return sandwichMock.create()
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

  describe('PUT /sandwiches/:id', () => {
    test('200', () => {
      let tempSandwich; 
      return sandwichMock.create()
      .then(sandwich => {
        tempSandwich = sandwich;
        return superagent.put(`${apiURL}/sandwiches/${sandwich._id}`)
        .send({
          title: 'badass sammy',
          veggies: ['onions', 'banana peppers'],
        });
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempSandwich._id.toString());
        expect(res.body.title).toEqual('badass sammy');
        expect(res.body.veggies).toEqual(['onions', 'banana peppers']);
      });
    });
  });

  describe('DELETE /sandwiches/:id', () => {
    test('200', () => {
      let tempSandwich;
      return sandwichMock.create()
      .then(sandwich => {
        tempSandwich = sandwich;
        return superagent.delete(`${apiURL}/sandwiches/${sandwich._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(204);
      });
    });
  });

});
