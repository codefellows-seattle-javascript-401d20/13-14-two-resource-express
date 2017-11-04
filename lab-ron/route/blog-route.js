'use strict';

const { Router } = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Blog = require('../model/blog.js');

const blogRouter = module.exports = new Router();

blogRouter.get('/blogs/:id', (req, res, next) => {
  Blog.findById(req.params.id)
    .populate('user')
    .then(blog => {
      if (!blog)
        return httpErrors(404, 'blog not found');
      res.json(blog);
    })
    .catch(next);
});

blogRouter.post('/blogs', jsonParser, (req, res, next) => {
  new Blog(req.body).save()
    .then(blog => res.json(blog))
    .catch(next);
});



