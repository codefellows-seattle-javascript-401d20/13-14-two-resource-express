'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const Book = require('../model/book.js');

const bookRouter = module.exports = new Router();

bookRouter.post('/books', jsonParser, (req, res, next) => {
  if(!req.body.title || !req.body.author)
    return next(httpErrors(400, 'title and author are required'));

  new Book(req.body).save()
    .then(book => res.json(book))
    .catch(next);
});

bookRouter.put('/books/:id', jsonParser, (req, res, next) => {
  if(!req.body.title || !req.body.author)
    return next(httpErrors(400, 'title and author are required'));

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

bookRouter.get('/api/books', (req, res, next) => {
  let {page='0'} = req.query;
  page = Number(page);
  if(isNaN(page)) page = 0;
  page = page < 0 ? 0 : page;

  let booksCache;
  Book.find({})
    .skip(page * 100)
    .limit(100)
    .then(books => {
      booksCache = books;
      return Book.find({}).count();
    })
    .then(count => {
      let result = {
        count,
        data: booksCache,
      };

      let lastPage = Math.floor(count / 100);
      res.links({
        next: `http://localhost/api/books?page=${page+1}`,
        prev: `http://localhost/api/books?page=${page < 1 ? 0 : page - 1}`,
        last: `http://localhost/api/books?page=${lastPage}`,
      });
      res.json(result);
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
