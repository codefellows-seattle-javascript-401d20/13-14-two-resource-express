'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Review = require('../model/review.js');

const reviewRouter = module.exports = new Router();

reviewRouter.post('/reviews', jsonParser, (req, res, next) => {
  if(!req.body.title || !req.body.content)
    return next(httpErrors(400, 'title and content are required'));

  new Review(req.body).save()
  .then(review => res.json(review))
  .catch(next);
});

reviewRouter.get('/reviews/:id', (req, res, next) => {
  Review.findById(req.params.id)
  .populate('book')
  .then(review => {
    if(!review)
      return httpErrors(404, 'review not found');
    res.json(review);
  })
  .catch(next);
});

reviewRouter.delete('/reviews/:id', (req, res, next) => {
  Review.findByIdAndRemove(req.params.id)
  .then(review => {
    if(!review)
      throw httpErrors(404, 'book not found');
    res.sendStatus(204);
  })
  .catch(next);
});
