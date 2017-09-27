'use strict';

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  title: {type: String, required: true, unique: true},
  console: {type: String, required: true},
  genre: {type: String, required: true},
  timestamp: {type: Date, default: () => new Date()},
  // reviews: [{type: mongoose.Schema.Types.ObjectID, ref: 'review'}]
});

module.exports = mongoose.model('videogame', categorySchema);
