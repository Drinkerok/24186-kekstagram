'use strict';
var parameters = require('./parameters');
var createImg = require('./create_img');
var gallery = require('./gallery');

module.exports = {
  RenderPicture: function(data){
    this.data = data;
    this.picture = createImg.createPicture(this.data, parameters.blockPictures);

    this.onPictureClick = function(e){
      e.preventDefault();
      gallery.showGallery(data);
    }

    this.remove = function(e){
      this.picture.removeEventListener('click', this.onPictureClick);
      this.picture.parentNode.removeChild(this.picture);
    }

    this.picture.addEventListener('click', this.onPictureClick);
  }
}