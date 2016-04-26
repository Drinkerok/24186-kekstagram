'use strict';
var parameters = require('./parameters');
var createPicture = require('./create_img');
var gallery = require('./gallery');

module.exports = function(data) {
  this.data = data;
  this.picture = createPicture(this.data, parameters.blockPictures);

  this.onPictureClick = function(e) {
    e.preventDefault();
    gallery.showGallery(data);
  };

  this.remove = function() {
    this.picture.removeEventListener('click', this.onPictureClick);
    this.picture.parentNode.removeChild(this.picture);
  };

  this.picture.addEventListener('click', this.onPictureClick);
};
