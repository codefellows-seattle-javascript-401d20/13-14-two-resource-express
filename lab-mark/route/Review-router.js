'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();

const Review = require('../model/Review.js');
const reviewRouter = module.exports = new Router();

reviewRouter.post('/api/reviews', jsonParser, (req, res, next) => {
  new Review(req.body).save()
    .then(review => res.json(review))
    .catch(next);
});

reviewRouter.get('/api/reviews/:id', (req, res, next) => {
  Review.findById(req.params.id)
    .populate('videogame')
    .then(review => {
      if(!review)
        return httpErrors(404, 'card not found');
      res.json(review);
    })
    .catch(next);
});

reviewRouter.get('/api/reviews', (req, res, next) => {
  let {page='0'} = req.query;
  page = Number(page);
  if(isNaN(page))
    page = 0;
  page = page < 0 ? 0 : page;

  let reviewsCache;
  Review.find({})
    .skip(page * 10)
    .limit(10)
    .then(reviews => {
      reviewsCache = reviews;
      return Review.find({}).count();
    })
    .then(count => {
      let result = {
        count,
        data: reviewsCache,
      };

      let lastPage = Math.floor(count / 10);
      res.links({
        next: `http://localhost/api/reviews?page=${page+1}`,
        prev: `http://localhost/api/reviews?page=${page < 1 ? 0 : page - 1}`,
        last: `http://localhost/api/reviews?page=${lastPage}`,
      });
      res.json(result);
    })
    .catch(next);
});

reviewRouter.delete('/api/reviews/:id', (req, res, next) => {
  Review.findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});

reviewRouter.delete('/api/reviews', () => {
  // No delete all feature!
  throw httpErrors(400, 'Can\'t delete all notes.');
});

reviewRouter.put('/api/reviews/:id', jsonParser, (req, res, next) => {

  Review.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true})
    .then((review) => {
      if(!review)
        throw httpErrors(404, 'review not found');
      res.json(review);
    })
    .catch(next);
});
