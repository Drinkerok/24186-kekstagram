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
  this.onLikesClick = this.onLikesClick.bind(this);

  this.likesBlock.addEventListener('click', this.onLikesClick);

  // обработчик смены hash
  window.addEventListener('hashchange', this.hashChange.bind(this));
}

Gallery.prototype.showGallery = function(picture) {
  window.location.hash = picture.url;
};
Gallery.prototype.showPicture = function() {
  this.picture = this.findPictureByUrl(window.location.hash.slice(1), parameters.sortedPictures);
  this.galleryOverlay.classList.remove('invisible');
  loadImage(this.picture, this.galleryImg);
  this.commentsBlock.innerHTML = this.picture.comments;
  this.likesBlock.innerHTML = this.picture.likes;
  window.addEventListener('keydown', this.closeGalleryEsc);
  this.galleryCloseButton.addEventListener('click', this.onCloseButtonClick);

  this.imgInArray = this.findPictureNumber(this.picture);
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
Gallery.prototype.findPictureByUrl = function(url, arr, deep) {
  if (!deep) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].url === url) {
        return arr[i];
      }
    }
  } else {
    for (i = 0; i < arr.length; i++) {
      if (arr[i].data.url === url) {
        return arr[i];
      }
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
Gallery.prototype.onLikesClick = function(e) {
  e.preventDefault();
  this.picture.increaseLikes();
  // Если картинка отрисована, меняем у нее счетчик
  var pictureInRenderedArray = this.findPictureByUrl(this.picture.url, parameters.renderedPictures, true);
  if (pictureInRenderedArray !== -1) {
    pictureInRenderedArray.increaseLikes();
  }
  e.target.innerHTML = +(e.target.innerHTML) + 1;
};

module.exports = new Gallery();
