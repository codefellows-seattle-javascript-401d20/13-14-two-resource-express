'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Beer = require('../model/beer.js');

const beerRouter = module.exports = new Router();

beerRouter.post('/beers', jsonParser, (req, res, next) => {
  if(!req.body.brand)
    return next(httpErrors(400, 'Beer model requires a brand'));

  new Beer(req.body).save()
  .then(beer => res.json(beer))
  .catch(next);
});

beerRouter.put('/beers/:id', jsonParser, (req, res, next) => {
  let options = {new: true, runValidators: true};
  Beer.findByIdAndUpdate(req.params.id, req.body, options)
  .then(beer => {
    if(!beer)
      throw httpErrors(404, 'beer not found');
    res.json(beer);
  })
  .catch(next);
});

beerRouter.get('/beers/:id', (req, res, next) => {
  Beer.findById(req.params.id)
  .then(beer => {
    if(!beer)
      throw httpErrors(404, 'beer not found');
    res.json(beer);
  })
  .catch(next);
});

beerRouter.delete('/beers/:id', (req, res, next) => {
  Beer.findByIdAndRemove(req.params.id)
  .then(beer => {
    if(!beer)
      throw httpErrors(404, 'beer not found');
    res.sendStatus(204);
  })
  .catch(next);
});
