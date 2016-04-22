'use strict';

module.exports = {
  // Виден ли конец блока с картинками
  isBottomReached: function(block_pictures) {
    var block_coords = block_pictures.getBoundingClientRect();
    return (Math.floor(block_coords.bottom) <= window.innerHeight) ? true : false;
  }
}
