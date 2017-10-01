'use strict';

const {Router} = require('express');
const httpError = require('http-errors');
const jsonParser = require('body-parser').json();
const Book = require('./model/book.js');

const bookRouter = module.exports = new Router();

bookRouter.get('/book:id', (req, res, next) => {
  Book.findById(req.params.id)
    .populate('book')
    .then(book => {
      if(!book)
        return httpError(404, 'book not found');
      res.json(book);
    })
    .catch(next);
});
bookRouter.post('/book', jsonParser, (req, res, next) => {
  new Book(req.body).save()
    .then(book => res.json(book))
    .catch(next);
});
