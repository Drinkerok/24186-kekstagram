'use strict';
var parameters = require('./parameters');
var createPicture = require('./create_img');
var gallery = require('./gallery');
var domConstructor = require('./domConstructor');
var utilites = require('./utilites');

function RenderedPicture(data) {
  this.data = data;
  this.picture = createPicture(this.data);
  this.likesBlock = this.picture.querySelector('.picture-likes');


  this.onPictureClick = function(e) {
    e.preventDefault();
    gallery.showGallery(data);
  };

  this.remove = function() {
    this.picture.removeEventListener('click', this.onPictureClick);
    // this.picture.parentNode.removeChild(this.picture);
    domConstructor.prototype.remove.apply(this, [this.picture, parameters.blockPictures]);
  };

  this.add = function() {
    domConstructor.prototype.add.apply(this, [this.picture, parameters.blockPictures]);
    // parameters.blockPictures.appendChild(this.picture);
  };

  this.increaseLikes = function() {
    this.likesBlock.innerHTML = +this.likesBlock.innerHTML + 1;
  };

  this.add();
  this.picture.addEventListener('click', this.onPictureClick);
}

utilites.inherit(RenderedPicture, domConstructor);

module.exports = RenderedPicture;
