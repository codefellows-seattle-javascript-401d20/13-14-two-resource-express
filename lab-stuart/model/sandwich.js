'use strict';

const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const Menu = require('./menu.js');

const sandwichSchema = mongoose.Schema({
  title: {type: String, required: true, unique: true},
  bread: {type: String, required: true},
  cheese: {type: String},
  spread: [{type: String}],
  veggies: [{type: String}],
});

sandwichSchema.pre('save', function(done){
  Menu.findById(this.menu)
  .then(menu => {
    if(!menu)
      throw httpErrors(404, 'menu not found');
    menu.sandwiches.push(this._id);
    return menu.save();
  })
  .then(() => done())
  .catch(done);
});

sandwichSchema.post('remove', (doc, done) => {
  Menu.findById(doc.sandwich)
  .then(menu => {
    if(!menu)
      throw httpErrors(404, 'menu not found');
    menu.sandwiches = menu.sandwiches.filter(sandwich => {
      return sandwich._id.toString() !== doc._id.toString();
    });
    return menu.save();
  })
  .then(() => done())
  .catch(done);
});

module.exports = mongoose.model('sandwiche', sandwichSchema);
