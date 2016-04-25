'use strict';

var parameters = require('./parameters');

var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryImg = document.querySelector('.gallery-overlay-image');
var galleryCloseButton = document.querySelector('.gallery-overlay-close');


// parameters.blockPictures.addEventListener('click', function(e) {
//   e.preventDefault();
//   if (e.target.nodeName !== 'IMG') return false;

//   var img = e.target;
//   showGallery(img);
//   // номер картикнки в массиве картинок
//   var imgInArray = findPictureNumber(img);

//   galleryImg.addEventListener('click', function(e) {
//     e.preventDefault();
//     imgInArray++;
//     if (imgInArray > parameters.sortedPictures.length-1) imgInArray = 0;
//     this.src = parameters.sortedPictures[imgInArray].url;
//   })

//   window.addEventListener('keydown', function(e) {
//     if (e.keyCode === 27) {
//       closeGallery();
//     }
//   });
// })

var imgInArray;

function closeGallery() {
  galleryOverlay.classList.add('invisible');
  window.removeEventListener('keydown', closeGalleryEsc);
  galleryImg.removeEventListener('click', showNextPicture);
}
function closeGalleryEsc(e) {
  if (e.keyCode === 27) {
    closeGallery();
  }
}
function findPictureNumber(img) {
  for (var i=0; i<parameters.sortedPictures.length; i++) {
    if (img.url.lastIndexOf(parameters.sortedPictures[i].url) > -1) return i;
  }
  return false;
}
function showNextPicture(e) {
  e.preventDefault();
  imgInArray++;
  if(imgInArray > parameters.sortedPictures.length - 1) imgInArray = 0;
  this.src = parameters.sortedPictures[imgInArray].url;
}

galleryCloseButton.addEventListener('click', function(e) {
  e.preventDefault();
  closeGallery();
});


module.exports = {
  showGallery: function(picture) {
    galleryOverlay.classList.remove('invisible');
    galleryImg.src = picture.url;
    window.addEventListener('keydown', closeGalleryEsc);

    imgInArray = findPictureNumber(picture);

    galleryImg.addEventListener('click', showNextPicture);
  }
};
