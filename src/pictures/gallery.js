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
    clearTimeout(pictureLoadTimeout);
    imageHtml.src = noPhotoPath;
  };
  nextImage.src = imageToShow.url;
  pictureLoadTimeout = setTimeout(function() {
    imageHtml.src = noPhotoPath;
  }, 10000);
}

function Gallery() {
  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryImg = document.querySelector('.gallery-overlay-image');
  this.galleryCloseButton = document.querySelector('.gallery-overlay-close');
  this.commentsBlock = document.querySelector('.comments-count');
  this.likesBlock = document.querySelector('.likes-count');
  this.imgInArray = 0;

  this.showPicture = this.showPicture.bind(this);
  this.closeGallery = this.closeGallery.bind(this);
  this.closeGalleryEsc = this.closeGalleryEsc.bind(this);
  this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
  this.showNextPicture = this.showNextPicture.bind(this);
  this.checkUrl = this.checkUrl.bind(this);

  // обработчик смены hash
  window.addEventListener('hashchange', this.hashChange.bind(this));
}

Gallery.prototype.showGallery = function(picture) {
  window.location.hash = picture.url;
};
Gallery.prototype.showPicture = function() {
  var picture = this.findPictureByUrl(window.location.hash.slice(1));
  this.galleryOverlay.classList.remove('invisible');
  loadImage(picture, this.galleryImg);
  this.commentsBlock.innerHTML = picture.comments;
  this.likesBlock.innerHTML = picture.likes;
  window.addEventListener('keydown', this.closeGalleryEsc);
  this.galleryCloseButton.addEventListener('click', this.onCloseButtonClick);

  this.imgInArray = this.findPictureNumber(picture);
  this.galleryImg.addEventListener('click', this.showNextPicture);
};
Gallery.prototype.closeGallery = function() {
  this.galleryCloseButton.removeEventListener('click', this.onCloseButtonClick);
  window.removeEventListener('keydown', this.closeGalleryEsc);
  this.galleryImg.removeEventListener('click', this.showNextPicture);
  this.galleryOverlay.classList.add('invisible');

  window.location.hash = '';
};
Gallery.prototype.closeGalleryEsc = function(e) {
  if (e.keyCode === 27) {
    this.closeGallery();
  }
};
Gallery.prototype.onCloseButtonClick = function(e) {
  e.preventDefault();
  this.closeGallery();
};
Gallery.prototype.findPictureNumber = function(img) {
  for (var i = 0; i < parameters.sortedPictures.length; i++) {
    if (img.url.lastIndexOf(parameters.sortedPictures[i].url) > -1) {
      return i;
    }
  }
  return false;
};
Gallery.prototype.findPictureByUrl = function(url) {
  for (var i = 0; i < parameters.sortedPictures.length; i++) {
    if (parameters.sortedPictures[i].url === url) {
      return parameters.sortedPictures[i];
    }
  }
  return false;
};
Gallery.prototype.showNextPicture = function(e) {
  var nextPicture;
  e.preventDefault();
  this.imgInArray++;
  if (this.imgInArray > parameters.sortedPictures.length - 1) {
    this.imgInArray = 0;
  }
  nextPicture = parameters.sortedPictures[this.imgInArray];
  window.location.hash = nextPicture.url;
};
Gallery.prototype.checkUrl = function() {
  if (window.location.hash.match(/#photos\/(\S+)/)) {
    this.showPicture();
  }
};
Gallery.prototype.hashChange = function() {
  if (window.location.hash === '') {
    this.closeGallery();
  } else if (window.location.hash.match(/#photos\/(\S+)/) || window.location.hash.match('failed')) {
    this.showPicture();
  }
};

module.exports = new Gallery();
