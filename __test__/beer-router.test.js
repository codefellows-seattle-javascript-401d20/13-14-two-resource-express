'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const beerMock = require('./lib/beer-mock.js');
const breweryMock = require('./lib/brewery-mock.js');

let apiURL = `http://localhost:${process.env.PORT}`;

describe('/beers', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(beerMock.remove);

  describe('POST /beers/id', () => {
    test('should return 200 and a beer', () => {
      let tempMock;
      expect(1).toEqual(1);
      return breweryMock.create()
        .then(mock  => {
          tempMock = mock;
          return superagent.post(`${apiURL}/beers`)
          .send({
            name: 'Lush',
            beerstyle: 'IPA',
            brewery: mock._id,
          });
        })
        .then(res => {
          console.log(res.body);
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.brewery).toEqual(tempMock._id.toString());
          expect(res.body.name).toEqual('Lush');
          expect(res.body.beerstyle).toEqual('IPA');
        });
    });

    test('should return 404 ', () => {
      return superagent.post(`${apiURL}/beers`)
        .send({
          name: 'Lush',
          beerstyle: 'IPA',
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('GET /beers/:id', () => {
    test('should return 200 and a beer', () => {
      let tempMock;
      return beerMock.create()
        .then(mock  => {
          tempMock = mock;
          return superagent.get(`${apiURL}/beers/${mock.beer._id}`);
        })
        .then(res => {
          console.log(res.body);
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempMock.beer._id.toString());
          expect(res.body.name).toEqual(tempMock.beer.name);
          expect(res.body.beerstyle).toEqual(tempMock.beer.beerstyle);
          expect(res.body.brewery._id).toEqual(tempMock.brewery._id.toString());
          expect(res.body.brewery.breweryname).toEqual(tempMock.brewery.breweryname);
        });
    });
  });

  describe('DELETE /beers/:id', () => {
    test('204', () => {
      let tempMock;
      return beerMock.create()
      .then(mock  => {
        tempMock = mock;
        return superagent.delete(`${apiURL}/beers/${mock.beer._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(204);
      });
    });
    test('should respond with a 404 status when deleting a non-existent beer', () => {
      let tempMock;
      return beerMock.create()
      .then(mock  => {
        tempMock = mock;
        return superagent.delete(`${apiURL}/beers/12323123123124124123`);
      })
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });
});
