'use strict';

const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: {type: String, required: true, unique: true},
  author: {type: String, required: true, unique: true},
  chapterContent: {type: String, unique: true},
  timestamp: {type: Date, default: () => new Date()},
});

module.exports = mongoose.model('book', bookSchema);
