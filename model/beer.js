'use strict';

const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const Brewery = require('./brewery.js');

const beerSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  beerstyle: {type: String, required: true},
  abv: {type: String},
  brewery: {type: mongoose.Schema.Types.ObjectID, require: true, ref: 'brewerie'},
});

// make sure beer exists before creating one
beerSchema.pre('save', function(done){
  Brewery.findById(this.brewery)
  .then(brewery => {
    if(!brewery)
      throw httpErrors(404, 'brewery not found');
    brewery.beers.push(this._id);
    return brewery.save();
  })
  .then(() => done())
  .catch(done);
});

beerSchema.post('remove', (doc, done) => {
  Brewery.findById(doc.brewery)
  .then(brewery => {
    if(!brewery)
      throw httpErrors(404, 'brewery not found');
    brewery.beers = brewery.beers.filter(beer => {
      return beer._id.toString() !== doc._id.toString();
    });
    return brewery.save();
  })
  .then(() => done())
  .catch(done);
});

module.exports = mongoose.model('beer', beerSchema);
