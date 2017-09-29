'use strict'

const {Router} = require('express')
const httpErrors = require('http-errors')
const jsonParser = require('body-parser').json()
const Sandwich = require('../model/sandwich.js')

const sandwichRouter = module.exports = new Router()

sandwichRouter.get('/sandwiches/:id', (req, res, next) => {
  Sandwich.findById(req.params.id)
  .populate('menu')
  .then(sandwich => {
    if(!sandwich)
      return httpErrors(404, 'sandwich not found')
    res.json(sandwich)
  })
  .catch(next)
})

sandwichRouter.post('/sandwiches', jsonParser, (req, res, next) => {
  new Sandwich(req.body).save()
  .then(sandwich => res.json(sandwich))
  .catch(next)
})
