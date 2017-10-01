'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  fullname: { type: String, require: true },
  city: { type: String },
  state: { type: String },
  about: { type: String, require: false },
  timestamp: { type: Date, default: () => new Date() },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blog' }],
});


module.exports = mongoose.model('user', userSchema);