'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const sandwichMock = require('./lib/sandwich-mock.js');
const menuMock = require('./lib/menu-mock.js');

let apiURL = `http://localhost:${process.env.PORT}`;

describe('/sandwiches', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  afterEach(sandwichMock.remove)

  describe('POST /sandwiches/:id', () => {
    test('should return 200 and a sandwich', () => {
      let tempMock;
      return menuMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.post(`${apiURL}/sandwiches`)
            .send({
              title: 'Badass Sammy',
              bread: 'White',
              cheese: 'Cheddar',
              spread: ['Mayo', 'Mustard'],
              veggies: ['Lettuce', 'Onions'],
              menu: mock._id,
            });
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.title).toEqual('Badass Sammy');
          expect(res.body.bread).toEqual('White');
          expect(res.body.cheese).toEqual('Cheddar');
          expect(res.body.spread).toEqual(['Mayo','Mustard']);
          expect(res.body.veggies).toEqual(['Lettuce', 'Onions']);
          expect(res.body.menu).toEqual(tempMock._id.toString());
        });
    });

    test('409 due to duplicate title', () => {
      let tempMock;
      return sandwichMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.post(`${apiURL}/sandwiches`)
            .send({
              title: mock.sandwich.title,
              bread: 'French',
              menu: mock.menu._id,
            });
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(409);
        });
    });

    test('should return 404 ', () => {
      return superagent.post(`${apiURL}/sandwiches`)
        .send({
          title: 'Bad Sammy',
          bread: 'Lettuce',
          menu: 'badid',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('GET /sandwiches/:id', () => {
    test('should return 200 and a sandwich', () => {
      let tempMock;
      return sandwichMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/sandwiches/${mock.sandwich._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempMock.sandwich._id.toString());
          expect(res.body.title).toEqual(tempMock.sandwich.title);
          expect(res.body.bread).toEqual(tempMock.sandwich.bread);
          expect(res.body.cheese).toEqual(tempMock.sandwich.cheese);
          expect(JSON.stringify(res.body.spread))
            .toEqual(JSON.stringify(tempMock.sandwich.spread));
          expect(JSON.stringify(res.body.veggies))
            .toEqual(JSON.stringify(tempMock.sandwich.veggies));

          expect(res.body.menu._id).toEqual(tempMock.menu._id.toString());
          expect(res.body.menu.title).toEqual(tempMock.menu.title);
          expect(res.body.menu.timestamp).toEqual(tempMock.menu.timestamp.toISOString());
          expect(res.body.menu.type).toEqual(tempMock.menu.type);
        });
    });

    test('404', () => {
      let tempMock;
      return sandwichMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.delete(`${apiURL}/sandwiches/badId`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /sandwiches/:id', () => {
    test('204', () => {
      let tempMock;
      return sandwichMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.delete(`${apiURL}/sandwiches/${mock.sandwich._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });

    test('404', () => {
      let tempMock;
      return sandwichMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.delete(`${apiURL}/sandwiches/badId`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
