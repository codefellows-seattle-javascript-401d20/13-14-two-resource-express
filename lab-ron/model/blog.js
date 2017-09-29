'use strict';

const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true, unique: true },
  body: { type: String, required: false },
  tags: [{ type: String }],
  comments: [{ type: String }],
  isPublished: {type: Boolean},
  timestamp: { type: Date, default: () => new Date() },
});


module.exports = mongoose.model('blog', blogSchema);