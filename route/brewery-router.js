'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Brewery = require('../model/brewery.js');

const breweryRouter = module.exports = new Router();

breweryRouter.post('/breweries', jsonParser, (req, res, next) => {
  if(!req.body.breweryname)
    return next(httpErrors(400, 'Brewery model requires a brewery name'));

  new Brewery(req.body).save()
  .then(brewery => res.json(brewery))
  .catch(next);
});

breweryRouter.put('/breweries/:id', jsonParser, (req, res, next) => {
  let options = {new: true, runValidators: true};
  Brewery.findByIdAndUpdate(req.params.id, req.body, options)
  .then(brewery => {
    if(!brewery)
      throw httpErrors(404, 'brewery not found');
    res.json(brewery);
  })
  .catch(next);
});

breweryRouter.get('/breweries/:id', (req, res, next) => {
  Brewery.findById(req.params.id)
  .then(brewery => {
    if(!brewery)
      throw httpErrors(404, 'brewery not found');
    res.json(brewery);
  })
  .catch(next);
});

breweryRouter.delete('/breweries/:id', (req, res, next) => {
  Brewery.findByIdAndRemove(req.params.id)
  .then(brewery => {
    if(!brewery)
      throw httpErrors(404, 'brewery not found');
    res.sendStatus(204);
  })
  .catch(next);
});
