'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  about: { type: String },
  timestamp: { type: Date, default: () => new Date() },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blog' }],
});


module.exports = mongoose.model('user', userSchema);