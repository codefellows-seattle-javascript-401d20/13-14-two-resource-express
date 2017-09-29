'use strict';

// mock the env
require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const breweryMock = require('./lib/brewery-mock.js');

let apiURL = `http://localhost:${process.env.PORT}`;

describe('/breweries', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(breweryMock.remove);

  describe('POST /breweries', () => {
    test('200', () => {
      return superagent.post(`${apiURL}/breweries`)
      .send({
        breweryname: 'Fremont Brewery',
        location: 'Seattle',
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body.breweryname).toEqual('Fremont Brewery');
        expect(res.body.location).toEqual('Seattle');
      });
    });

    test('409 due to duplicate title', () => {
      return breweryMock.create()
      .then(brewery => {
        return superagent.post(`${apiURL}/breweries`)
        .send({
          breweryname: brewery.breweryname,
          location: brewery.location,
        });
      })
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(409);
      });
    });

    test('400 due to lack of brand', () => {
      return superagent.post(`${apiURL}/breweries`)
      .send({})
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });

    test('400 due to bad json', () => {
      return superagent.post(`${apiURL}/breweries`)
      .set('Content-Type', 'application/json')
      .send('{')
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });
  });

  describe('PUT /breweries/:id', () => {
    test('200', () => {
      let tempBrewery;
      return breweryMock.create()
      .then(brewery => {
        tempBrewery = brewery;
        return superagent.put(`${apiURL}/breweries/${brewery._id}`)
        .send({
          breweryname: 'Fremont',
          location: 'Seattle',
        });
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempBrewery._id.toString());
        expect(res.body.breweryname).toEqual('Fremont');
        expect(res.body.location).toEqual('Seattle');
      });
    });
  });

  describe('GET /breweries/:id', () => {
    test('200', () => {
      let tempBrewery;
      return breweryMock.create()
      .then(brewery => {
        tempBrewery = brewery;
        return superagent.get(`${apiURL}/breweries/${brewery._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempBrewery._id.toString());
        expect(res.body.breweryname).toEqual(tempBrewery.breweryname);
        expect(res.body.location).toEqual(tempBrewery.location);
      });
    });
  });

  describe('DELETE /breweries/:id', () => {
    test('200', () => {
      let tempBrewery;
      return breweryMock.create()
      .then(brewery => {
        tempBrewery = brewery;
        return superagent.delete(`${apiURL}/breweries/${brewery._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(204);
      });
    });
  });
});
