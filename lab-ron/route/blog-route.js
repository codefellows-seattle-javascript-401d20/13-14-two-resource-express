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
      res.json(blog);
    })
    .catch(next);
});

blogRouter.post('/blogs', jsonParser, (req, res, next) => {
  new Blog(req.body).save()
    .then(blog => res.json(blog))
    .catch(next);
});

blogRouter.put('/blogs/:id', jsonParser, (req, res, next) => {
  let options = { new: true, runValidators: true };
  Blog.findByIdAndUpdate(req.params.id, req.body, options)
    .then(blog => {
      /// WHY?????
      if (!blog) {
        console.log('---> IS IT GETTING HERE???');
        throw httpErrors(404, 'blog not found here');
      }
      res.json(blog);
    })
    .catch(next);
});

blogRouter.delete('/blogs/:id', (req, res, next) => {
  Blog.findByIdAndRemove(req.params.id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

