'use strict';

var parameters = require('./parameters');

function Gallery() {
  var self = this;
  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryImg = document.querySelector('.gallery-overlay-image');
  this.galleryCloseButton = document.querySelector('.gallery-overlay-close');
  this.commentsBlock = document.querySelector('.comments-count');
  this.likesBlock = document.querySelector('.likes-count');
  this.imgInArray = 0;

  this.showGallery = function(picture) {
    this.galleryOverlay.classList.remove('invisible');
    this.galleryImg.src = picture.url;
    this.commentsBlock.innerHTML = picture.comments;
    this.likesBlock.innerHTML = picture.likes;
    window.addEventListener('keydown', self.closeGalleryEsc);
    this.galleryCloseButton.addEventListener('click', self.onCloseButtonClick);

    this.imgInArray = self.findPictureNumber(picture);
    self.galleryImg.addEventListener('click', self.showNextPicture);
  };
  this.closeGallery = function(e) {
    this.galleryCloseButton.removeEventListener('click', self.onCloseButtonClick);
    window.removeEventListener('keydown', self.closeGalleryEsc);
    self.galleryImg.removeEventListener('click', self.showNextPicture);
    self.galleryOverlay.classList.add('invisible');
  };
  this.closeGalleryEsc = function(e) {
    if (e.keyCode === 27) {
      self.closeGallery();
    }
  };
  this.onCloseButtonClick = function(e) {
    e.preventDefault();
    self.closeGallery();
  };
  this.findPictureNumber = function(img) {
    for (var i = 0; i < parameters.sortedPictures.length; i++) {
      if (img.url.lastIndexOf(parameters.sortedPictures[i].url) > -1) {
        return i;
      }
    }
    return false;
  };
  this.showNextPicture = function(e) {
    var nextPicture;
    e.preventDefault();
    self.imgInArray++;
    if (self.imgInArray > parameters.sortedPictures.length - 1) {
      self.imgInArray = 0;
    }
    nextPicture = parameters.sortedPictures[self.imgInArray];
    self.galleryImg.src = nextPicture.url;
    self.commentsBlock.innerHTML = nextPicture.comments;
    self.likesBlock.innerHTML = nextPicture.likes;
  };
};

module.exports = {
  gallery: new Gallery()
};
