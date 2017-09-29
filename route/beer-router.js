'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Beer = require('../model/beer.js');

const beerRouter = module.exports = new Router();

beerRouter.get('/beers/:id', (req, res, next) => {
  Beer.findById(req.params.id)
  .populate('brewery')
  .then(beer => {
    if(!beer)
      return httpErrors(404, 'beer not found');
    res.json(beer);
  })
  .catch(next);
});

beerRouter.post('/beers', jsonParser, (req, res, next) => {
  new Beer(req.body).save()
  .then(beer => res.json(beer))
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
