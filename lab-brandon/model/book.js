'use strict';

const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: {type: String, required: true, unique: true},
  keywords: [{type: String}],
  timestamp: {type: Date, default: () => new Date()},
});

module.exports = mongoose.model('book', bookSchema);
