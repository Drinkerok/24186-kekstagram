'use strict';

var parameters = require('./parameters');

function loadImage(imageToShow, imageHtml) {
  var pictureLoadTimeout;
  var nextImage = new Image();
  var noPhotoPath = 'photos/no-photo.jpg';

  nextImage.onload = function() {
    clearTimeout(pictureLoadTimeout);
    imageHtml.src = nextImage.src;
  };
  nextImage.onerror = function() {
    imageHtml.src = noPhotoPath;
  };
  nextImage.src = imageToShow.url;
  pictureLoadTimeout = setTimeout(function() {
    imageHtml.src = noPhotoPath;
  }, 10000);
}

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
    loadImage(picture, this.galleryImg);
    this.commentsBlock.innerHTML = picture.comments;
    this.likesBlock.innerHTML = picture.likes;
    window.addEventListener('keydown', self.closeGalleryEsc);
    this.galleryCloseButton.addEventListener('click', self.onCloseButtonClick);

    this.imgInArray = self.findPictureNumber(picture);
    self.galleryImg.addEventListener('click', self.showNextPicture);
  };
  this.closeGallery = function() {
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

    loadImage(nextPicture, self.galleryImg);

    self.commentsBlock.innerHTML = nextPicture.comments;
    self.likesBlock.innerHTML = nextPicture.likes;
  };
}

module.exports = new Gallery();
