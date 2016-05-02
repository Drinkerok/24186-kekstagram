'use strict';

function LoadedPicture(picture) {
  this.url = picture.url;
  this.likes = picture.likes;
  this.comments = picture.comments;
  this.date = picture.date;

  this.getPicture = function() {
    return this.picture;
  };
  this.getComments = function() {
    return this.comments;
  };
  this.getLikes = function() {
    return this.likes;
  };
  this.getDate = function() {
    return this.date;
  };
  this.increaseLikes = function() {
    return ++this.likes;
  };
}

module.exports = LoadedPicture;
