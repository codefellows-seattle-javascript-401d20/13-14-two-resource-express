'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const menuMock = require('./lib/menu-mock.js');
const sandwichMock = require('./lib/sandwich-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/menus', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(menuMock.remove);

  describe.only('POST /menus/id', () => {
    test('should return 200 and a menu', () => {
      let tempMock;
      return sandwichMock.create()
      .then(mock  => {
        tempMock = mock;
        return superagent.post(`${apiURL}/sandwiches`)
        .send({
          title: 'Badass Sammy',
          bread: 'White',
          cheese: 'Cheddar',
          spread: ['Mayo', 'Mustard'],
          veggies: ['Lettuce', 'Onion'],
          menu: mock._id,
        });
      })
      .then(res => {
        console.log(res.body);
        expect(res.status).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body.menu).toEqual(tempMock._id.toString());
        expect(res.body.title).toEqual('Badass Sammy');
        expect(res.body.bread).toEqual('White');
        expect(res.body.cheese).toEqual('Cheddar');
        expect(res.body.spread).toEqual(['Mayo', 'Mustard']);
        expect(res.body.veggies).toEqual(['Lettuce', 'Onion']);
      });
    });

    test('should return 404 ', () => {
      return superagent.post(`${apiURL}/menus`)
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

  describe('GET /menus/:id', () => {
    test('should return 200 and a menu', () => {
      let tempMock;
      return menuMock.create()
      .then(mock  => {
        tempMock = mock;
        return superagent.get(`${apiURL}/sandwiches/${mock.sandwich._id}`);
      })
      .then(res => {
        console.log(res.body);
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempMock.menu._id.toString());
        expect(res.body.title).toEqual(tempMock.menu.title);
        expect(res.body.sandwich.title).toEqual(tempMock.sandwich.title);
        expect(res.body.sandwich.bread).toEqual(tempMock.sandwich.bread);
        expect(res.body.sandwich.cheese).toEqual(tempMock.sandwich.cheese);
        expect(res.body.sandwich.spread).toEqual(tempMock.sandwich.spread);
        expect(res.body.sandwich.veggies).toEqual(tempMock.sandwich.veggies);
      });
    });
  });
});
