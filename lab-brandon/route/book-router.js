'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Book = require('../model/book.js');

const bookRouter = module.exports = new Router();

bookRouter.post('/books', jsonParser, (req, res, next) => {
  if(!req.body.title)
    return next(httpErrors(400, 'Book model requires a title'));

  new Book(req.body).save()
    .then(book => res.json(book))
    .catch(next);
});

bookRouter.put('/books/:id', jsonParser, (req, res, next) => {
  let options = {new: true, runValidators: true};
  Book.findByIdAndUpdate(req.params.id, req.body, options)
    .then(book => {
      if(!book)
        throw httpErrors(404, 'book not found');
      res.json(book);
    })
    .catch(next);
});

bookRouter.get('/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if(!book)
        throw httpErrors(404, 'book not found');
      res.json(book);
    })
    .catch(next);
});

bookRouter.delete('/books/:id', (req, res, next) => {
  Book.findByIdAndRemove(req.params.id)
    .then(book => {
      if(!book)
        throw httpErrors(404, 'book not found');
      res.sendStatus(204);
    })
    .catch(next);
});
