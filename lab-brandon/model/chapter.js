'use strict';

const mongoose = require('mongoose');
const httpError = require('http-errors');
const Book = require('./book.js');

const chapterSchema = mongoose.schema({
  content:{type: String, require: true, minLength: 15},
  book: {type: mongoose.schema.Types.ObjectId, required:true, ref: 'book'},
  timestamp:{type: Date, default: () => new Date()},
});

//pre and post(save and remove)
chapterSchema.pre('save', function(done){
  return Book.findById(this.book)
    .then(book =>{
      if(!book)
      //404 means not found
        throw httpError(404, 'book not found');
      Book.Chapters.push(this.id);
      return book.save();
    })
    .then(() => done())
    .catch(done);
});
chapterSchema.post('save', (doc, done)=>{
  return Book.findById(doc.book)
    .then(book =>{
      if(!book)
      //404 means not found
        throw httpError(404, 'book not found');
      book.chapter = book.chapter.filter(book =>{
        return book._id.toString() !== doc._id.toString();
      });
      return book.save();
    })
    .then(() => done())
    .catch(done);
});

module.exports = mongoose.model('chapter',chapterSchema);
