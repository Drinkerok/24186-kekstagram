'use strict';

var utilites = require('./utilites');
var settings = require('./parameters');
var createPage = require('./create_page');

module.exports = {
  enable_scroll: function() {
    var scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        if (utilites.isBottomReached(settings.blockPictures) && (settings.pictures_settings.page <= settings.pictures_settings.page_max)) {
          createPage.createPicturesPage(settings.sortedPictures);
        }
      }, 100);
    });
  }
};
