'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const blogMock = require('./lib/blog-mock.js');
const userMock = require('./lib/user-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/blogs', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(userMock.remove);
  afterEach(blogMock.remove);

  describe('POST /blogs/id', () => {
    test('should return 200 and a blog', () => {
      let tempMock;
      return userMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.post(`${apiURL}/blogs`)
            .send({
              title: 'Hello World',
              body: 'this is the body',
              user: mock._id,
            });
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.timestamp).toBeTruthy();
          expect(typeof res.body.user).toEqual(typeof tempMock._id.toString());
          expect(res.body.body).toEqual('this is the body');
        });
    });

    test('should return 404 ', () => {
      return superagent.post(`${apiURL}/blogs`)
        .send({
          title: 'Hello World',
          body: 'this is the body',
          user: 'whatthefff',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('GET /blogs/:id', () => {
    test('should return 200 and a blog', () => {
      let tempMock;
      return blogMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/blogs/${mock.blog._id}`);
        })
        .then(res => {
           console.log('--> GET BLOG :', res.body)
           console.log('--> GET USER :', res.body.user)
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempMock.blog._id.toString());
          expect(res.body.body).toEqual(tempMock.blog.body);
          expect(res.body.timestamp).toEqual(tempMock.blog.timestamp.toJSON());
          expect(res.body.user._id).toEqual(tempMock.user._id.toString());
        });
    });
  });

  describe('PUT /blogs/:id', () => {
    test('returns 200 and a blog', () => {
      let tempMock;
      return blogMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.put(`${apiURL}/blogs/${mock.blog._id}`)
            .send({ body: 'this is my new entry for my blog :P' });
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempMock.blog._id.toString());
          expect(res.body.body).toEqual('this is my new entry for my blog :P');
        });
    });

    test('returns 404 ', () => {
      return blogMock.create()
        .then(() => superagent.put(`${apiURL}/blogs/badID`))
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });

    });


  });

  describe('DELETE /blogs/:id', () => {

    test('returns 204', () => {
      return blogMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/blogs/${mock.blog._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });

    test('returns 404 badID', () => {
      return blogMock.create()
        .then(() => superagent.delete(`${apiURL}/blogs/badID`))
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });

    });

  });
});
