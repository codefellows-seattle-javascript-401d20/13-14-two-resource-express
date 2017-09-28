'use strict';

// npm dependencies
const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

// app dependencies
const Book = require('../model/book.js');
// module interface
const bookRouter = module.exports = new Router();

// POST /api/<resource-name>
// pass data as stringifed JSON in the body of a POST request to create a new resource
// on success respond with a 200 status code and the created note
// on failure due to a bad request send a 400 status code
bookRouter.post('/books', jsonParser, (req, res, next) => {
  // create a book using the parsed body
  // and respond to the client
  if(!req.body.title || !req.body.author)
    return next(httpErrors(400, 'title and author are required'));

  new Book(req.body).save()
    .then(book => res.json(book))
    .catch(next);
});

// PUT /api/<resource-name>/:id
// should respond with the updated resource on success
// if the id is not found respond with a 404
// if the request is invalid it should respond with a 400
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

// GET /api/<resource-name>/:id
// should respond with the resource on success
// if the id is not found respond with a 404
bookRouter.get('/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if(!book)
        throw httpErrors(404, 'book not found');
      res.json(book);
    })
    .catch(next);
});


// DELETE /api/<resource-name>/:id
// the route should delete a note with the given id
// on success this should return a 204 status code with no content in the body
// on failure due to a resouce with that id not existing respond with a 404 status code
bookRouter.delete('/books/:id', (req, res, next) => {
  Book.findByIdAndRemove(req.params.id)
  .then(book => {
    if(!book)
      throw httpErrors(404, 'book not found');
    res.sendStatus(204);
  })
  .catch(next);
});

// bookRouter.get('/api/books', (req, res, next) => {
//   let {page='0'} = req.query;
//   page = Number(page);
//   if(isNaN(page)) page = 0;
//   page = page < 0 ? 0 : page;
//
//   let booksCache;
//   Book.find({})
//     .skip(page * 100)
//     .limit(100)
//     .then(books => {
//       booksCache = books;
//       return Book.find({}).count();
//     })
//     .then(count => {
//       let result = {
//         count,
//         data: booksCache,
//       };
//
//       let lastPage = Math.floor(count / 100);
//       res.links({
//         next: `http://localhost/api/books?page=${page+1}`,
//         prev: `http://localhost/api/books?page=${page < 1 ? 0 : page - 1}`,
//         last: `http://localhost/api/books?page=${lastPage}`,
//       });
//       res.json(result);
//     });
// });
