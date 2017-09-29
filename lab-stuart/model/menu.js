'use strict';

const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
  title: {type: String, required: true, unique: true},
  category: {type: String},
  timestamp: {type: Date, default: () => new Date()},
  sandwiches: [{type: mongoose.Schema.Types.ObjectId, ref: 'sandwich'}]
});

module.exports = mongoose.model('menu', menuSchema);
