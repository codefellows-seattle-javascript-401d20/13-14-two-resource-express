'use strict';

const { Router } = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const User = require('../model/user');


const userRouter = module.exports = new Router();

userRouter.post('/users', jsonParser, (req, res, next) => {
  if (!req.body.username || !req.body.password || !req.body.fullname || !req.body.email)
    return next(httpErrors(400, 'User model requires username, password, fullname, and email'));
  new User(req.body).save()
    .then(user => res.json(user))
    .catch(next);
});

userRouter.put('/users/:id', jsonParser, (req, res, next) => {
  let options = { new: true, runValidators: true };
  User.findByIdAndUpdate(req.params.id, req.body, options)
    .then(user => {
      if (!user)
        throw httpErrors(404, 'user not found');
      res.json(user);
    })
    .catch(next);
});

userRouter.get('/users/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user)
        throw httpErrors(404, 'user not found');
      res.json(user);
    })
    .catch(next);
});

userRouter.delete('/users/:id', (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      if (!user)
        throw httpErrors(404, 'user not found');
      res.sendStatus(204);
    })
    .catch(next);
});