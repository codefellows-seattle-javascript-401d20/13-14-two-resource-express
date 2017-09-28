'use strict';

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  // path: { type: String, require: false, unique: true }
  author: { type: String, required: true, unique: true },
  body: { type: String, required: false },
  tags: [{ type: String }],
  comments: [{ type: String }],
  isPublished: {type: Boolean},
  publishedOn: { type: Date, default: () => new Date() },
});


module.exports = mongoose.model('post', postSchema);