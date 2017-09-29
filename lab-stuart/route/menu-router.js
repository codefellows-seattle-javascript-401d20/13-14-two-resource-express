'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Menu = require('../model/menu.js');

const menuRouter = module.exports = new Router()

menuRouter.get('/menus/:id', (req, res, next) => {
  Menu.findById(req.params.id)
  .populate('menu')
  .then(menu => {
    if(!menu)
      return httpErrors(404, 'menu not found');
    res.json(menu);
  })
  .catch(next);
});

menuRouter.post('/menus', jsonParser, (req, res, next) => {
  new Card(req.body).save()
  .then(menu => res.json(menu))
  .catch(next);
});
