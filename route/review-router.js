'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Review = require('../model/review.js');

const reviewRouter = module.exports = new Router();

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

reviewRouter.post('/reviews', jsonParser, (req, res, next) => {
  new Review(req.body).save()
  .then(review => res.json(review))
  .catch(next);
});
