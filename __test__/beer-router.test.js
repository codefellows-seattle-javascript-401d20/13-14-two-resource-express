'use strict';

// mock the env
process.env.PORT = 7000;
process.env.CORS_ORIGIN = 'http://localhost:8080';
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server.js');
const Beer = require('../model/beer.js');

let apiURL = `http://localhost:${process.env.PORT}`;

let beerMockCreate = () => {
  return new Beer({
    brand: faker.lorem.words(7),
    beerstyle: faker.lorem.words(5),
  }).save();
};

let beerMockCreateMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => beerMockCreate()));
};

describe('/beers', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Beer.remove({}));

  describe('POST /beers', () => {
    test('200', () => {
      return superagent.post(`${apiURL}/beers`)
      .send({
        brand: 'Miller',
        beerstyle: 'lager',
        abv: '4.2',
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body.abv).toEqual('4.2');
        expect(res.body.brand).toEqual('Miller');
        expect(res.body.beerstyle).toEqual('lager');
      });
    });

    test('409 due to duplicate title', () => {
      return beerMockCreate()
      .then(beer => {
        return superagent.post(`${apiURL}/beers`)
        .send({
          brand: beer.brand,
          beerstyle: beer.beerstyle,
        });
      })
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(409);
      });
    });

    test('400 due to lack of brand', () => {
      return superagent.post(`${apiURL}/beers`)
      .send({})
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });

    test('400 due to bad json', () => {
      return superagent.post(`${apiURL}/beers`)
      .set('Content-Type', 'application/json')
      .send('{')
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });
  });

  describe('PUT /beers/:id', () => {
    test('200', () => {
      let tempBeer;
      return beerMockCreate()
      .then(beer => {
        tempBeer = beer;
        return superagent.put(`${apiURL}/beers/${beer._id}`)
        .send({
          brand: 'miller',
          beerstyle: 'lager',
        });
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempBeer._id.toString());
        expect(res.body.brand).toEqual('miller');
        expect(res.body.beerstyle).toEqual('lager');
      });
    });
  });

  describe('GET /beers/:id', () => {
    test('200', () => {
      let tempBeer;
      return beerMockCreate()
      .then(beer => {
        tempBeer = beer;
        return superagent.get(`${apiURL}/beers/${beer._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempBeer._id.toString());
        expect(res.body.beerstyle).toEqual(tempBeer.beerstyle);
        expect(res.body.brand).toEqual(tempBeer.brand);
      });
    });
  });

  describe('DELETE /beers/:id', () => {
    test('200', () => {
      let tempBeer;
      return beerMockCreate()
      .then(beer => {
        tempBeer = beer;
        return superagent.delete(`${apiURL}/beers/${beer._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(204);
      });
    });
  });
});
