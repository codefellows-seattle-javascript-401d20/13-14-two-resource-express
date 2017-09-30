'use strict';
process.env.PORT = 7000;
process.env.CORS_ORIGIN = 'http://localhos:8080';
process.env.MONGODB_URI = 'mongodb://localhost/testing';
const superagent = require('superagent');
const server = require('../lib/server.js');
const bookMock = require('./lib/book-mock.js');
const chapterMock = require('./lib/chapter-mock.js');
const apiUrl = `http://localhost/${process.env.PORT}`;

describe('/chapters', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(chapterMock.remove());

  describe('POST /chapter/id', () => {
    test('should return a chapter with a 200 "ok" status', () => {
      let tempMock;
      return bookMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.post(`${apiURL}/chapters`)
            .send({
              content: 'Ender was young as hell',
              book: book._id, 
            })
        })
    })
  })
})
