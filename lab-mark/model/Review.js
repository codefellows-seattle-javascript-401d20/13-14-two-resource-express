'use strict';

const mongoose = require('mongoose');
const VideoGame = require('./VideoGame.js');
const httpErrors = require('http-errors');

const reviewSchema = mongoose.Schema({
  content: {type: String, required:true},
  timestamp: {type: Date, default: () => new Date()},
  videogame: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'videogame'},
});

reviewSchema.post('save', (doc, done) => {
  VideoGame.findById(doc.videogame)
    .then(videogame => {
      if(!videogame)
        throw httpErrors(404, 'videogame not found');
      videogame.reviews.push(doc._id);
      return videogame.save();
    })
    .then(() => done())
    .catch(done);
});

reviewSchema.post('remove', (doc, done) => {
  VideoGame.findById(doc.videogame)
    .then(videogame => {
      if(!videogame)
        throw httpErrors(404, 'videogame not found');
      videogame.reviews = videogame.reviews.filter(review => {
        return review._id.toString() !== doc._id.toString();
      });
      return videogame.save();
    })
    .then(() => done())
    .catch(done);
});

module.exports = mongoose.model('review', reviewSchema);
