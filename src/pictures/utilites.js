'use strict';

module.exports = {
  // Виден ли конец блока с картинками
  isBottomReached: function(blockPictures) {
    var blockCoords = blockPictures.getBoundingClientRect();
    return (Math.floor(blockCoords.bottom) <= window.innerHeight) ? true : false;
  }
};
