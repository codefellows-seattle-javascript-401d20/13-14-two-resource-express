'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Sandwich = require('../model/sandwich.js');

const sandwichRouter = module.exports = new Router();

sandwichRouter.get('/sandwiches/:id', (req, res, next) => {
  Sandwich.findById(req.params.id)
  .then(sandwich => {
    if(!sandwich)
      throw httpErrors(404, 'sandwich not found');
    res.json(sandwich);
  })
  .catch(next);
});

sandwichRouter.post('/sandwiches', jsonParser, (req, res, next) => {
  if(!req.body.title || !req.body.bread)
    return next(httpErrors(400, 'title and bread are required'));
  new Sandwich(req.body).save()
  .then(sandwich => res.json(sandwich))
  .catch(next);
});

sandwichRouter.put('/sandwiches/:id', jsonParser, (req, res, next) => {
  let options = {new: true, runValidators: true};
  Sandwich.findByIdAndUpdate(req.params.id, req.body, options)
  .then(sandwich => {
    if(!sandwich)
      throw httpErrors(404, 'sandwich not found');
    res.json(sandwich);
  })
  .catch(next);
});

sandwichRouter.delete('/sandwiches/:id', (req, res, next) => {
  Sandwich.findByIdAndRemove(req.params.id)
  .then(sandwich => {
    if(!sandwich)
      throw httpErrors(404, 'sandwich not found');
    res.sendStatus(204);
  })
  .catch(next);
});
