'use strict';

const mongoose = require('mongoose');

const brewerySchema = mongoose.Schema({
  breweryname: {type: String, required: true, unique: true},
  location: {type: String, required: true},
  founded: {type: String},
  beers: [{type: mongoose.Schema.Types.ObjectId, ref: 'beer'}],
});

module.exports = mongoose.model('brewerie', brewerySchema);
