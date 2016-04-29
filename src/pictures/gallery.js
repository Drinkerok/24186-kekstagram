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
    window.location.hash = picture.url;
  };
  this.showPicture = function() {
    var picture = self.findPictureByUrl(window.location.hash.slice(1));
    self.galleryOverlay.classList.remove('invisible');
    loadImage(picture, this.galleryImg);
    self.commentsBlock.innerHTML = picture.comments;
    self.likesBlock.innerHTML = picture.likes;
    window.addEventListener('keydown', self.closeGalleryEsc);
    self.galleryCloseButton.addEventListener('click', self.onCloseButtonClick);

    self.imgInArray = self.findPictureNumber(picture);
    self.galleryImg.addEventListener('click', self.showNextPicture);
  }
  this.closeGallery = function() {
    self.galleryCloseButton.removeEventListener('click', self.onCloseButtonClick);
    window.removeEventListener('keydown', self.closeGalleryEsc);
    self.galleryImg.removeEventListener('click', self.showNextPicture);
    self.galleryOverlay.classList.add('invisible');

    window.location.hash = '';
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
  this.findPictureByUrl = function(url) {
    for (var i = 0; i < parameters.sortedPictures.length; i++) {
      if (parameters.sortedPictures[i].url === url) {
        return parameters.sortedPictures[i];
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
    window.location.hash = nextPicture.url;
  };
  this.checkUrl = function() {
    if (window.location.hash.match(/#photos\/(\S+)/)){
      self.showPicture();
    }
  }

  // обработчик смены hash
  window.addEventListener('hashchange', function() {
    if (window.location.hash === '') {
      self.closeGallery();
    } else if (window.location.hash.match(/#photos\/(\S+)/) || window.location.hash.match('failed')){
      self.showPicture();
    }
  })
}

module.exports = new Gallery();
