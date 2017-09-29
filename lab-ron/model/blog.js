'use strict';

const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const User = require('./user');

const blogSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true, unique: true },
  body: { type: String, required: false, default: '' },
  isPublished: { type: Boolean },
  timestamp: { type: Date, default: () => new Date() },
  user: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' }],
});

blogSchema.pre('save', function (done) {
  User.findById(this.user)
    .then(user => {
      if (!user)
        throw httpErrors(404, 'user not found');
      user.card.push(this._id);
      return user.save();
    })
    .then(() => done())
    .catch(done);
});

blogSchema.post('remove', (doc, done) => {
  User.findById(doc.user)
    .then(user => {
      if(!user)
        throw httpErrors(404, 'user not found');
      user.blogs = user.blogs.filter(blog => {
        return blog._id.toString() !== doc._id.toString();
      });
      return user.save();
    })
    .then(() => done())
    .catch(done);
});

module.exports = mongoose.model('blog', blogSchema);