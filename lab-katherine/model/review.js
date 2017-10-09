'use strict';

const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const Book = require('./book.js');

const reviewSchema = mongoose.Schema({
  title: {type: String, required: true, unique: true},
  author: {type: String},
  content: {type: String, required: true, minlength: 10},
  timestamp: {type: Date, default: () => new Date()},
  book: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'book'},
});

reviewSchema.pre('save', function(done) {
  Book.findById(this.book)
    .then(book => {
      if(!book)
        throw httpErrors(404, 'book not found');
      book.reviews.push(this._id);
      return book.save();
    })
    .then(() => done())
    .catch(done);
});

reviewSchema.post('remove', (doc, done) => {
  Book.findById(doc.book)
    .then(book => {
      if(!book)
        throw httpErrors(404, 'book not found');
      book.reviews = book.reviews.filter(review => {
        return review._id.toString() !== doc._id.toString();
      });
      return book.save();
    })
    .then(() => done())
    .catch(done);
});

module.exports = mongoose.model('review', reviewSchema);
