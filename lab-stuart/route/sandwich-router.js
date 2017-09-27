'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Sandwich = require('../model/sandwich.js');

const sandwichRouter = module.exports = new Router();

sandwichRouter.post('/sandwiches', jsonParser, (req, res, next) => {
  if(!req.body.title || !req.body.bread)
    return next(httpErrors(400, 'title and bread are required'));
  new Sandwich(req.body).save()
  .then(sandwich => res.json(sandwich))
  .catch(next);
});
