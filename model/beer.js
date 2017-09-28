'use strict';

const mongoose = require('mongoose');

const beerSchema = mongoose.Schema({
  brand: {type: String, required: true, unique: true},
  beerstyle: {type: String, required: true},
  abv: {type: String},
});

module.exports = mongoose.model('beer', beerSchema);
