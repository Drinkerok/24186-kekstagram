'use strict';

var utilites = require('./utilites');
var settings = require('./parameters');
var createPicturesPage = require('./create_page');

module.exports = function() {
  var scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (utilites.isBottomReached(settings.blockPictures) && (settings.pictures_settings.page <= settings.pictures_settings.page_max)) {
        createPicturesPage(settings.sortedPictures);
      }
    }, 100);
  });
};
