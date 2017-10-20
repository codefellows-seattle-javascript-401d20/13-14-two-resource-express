'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Menu = require('../model/menu.js');

const menuRouter = module.exports = new Router();

menuRouter.post('/menus', jsonParser, (req, res, next) => {
  if(!req.body.title)
    return next(httpErrors(400, 'Menu model requires a title'));

  new Menu(req.body).save()
    .then(menu => res.json(menu))
    .catch(next);
});

menuRouter.put('/menus/:id', jsonParser, (req, res, next) => {
  let options = {new: true, runValidators: true};
  Menu.findByIdAndUpdate(req.params.id, req.body, options)
    .then(menu => {
      if(!menu)
        throw httpErrors(404, 'menu not found');
      res.json(menu);
    })
    .catch(next);
});

menuRouter.get('/menus/:id', (req, res, next) => {
  Menu.findById(req.params.id)
    .then(menu => {
      if(!menu)
        throw httpErrors(404, 'menu not found');
      res.json(menu);
    })
    .catch(next);
});

menuRouter.delete('/menus/:id', (req, res, next) => {
  Menu.findByIdAndRemove(req.params.id)
    .then(menu => {
      if(!menu)
        throw httpErrors(404, 'menu not found');
      res.sendStatus(204);
    })
    .catch(next);
});
