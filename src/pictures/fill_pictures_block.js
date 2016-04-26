'use strict';

var utilites = require('./utilites');
var settings = require('./parameters');
var loaded = require('./load');
var createPicturesPage = require('./create_page');

module.exports = function() {
  while (utilites.isBottomReached(settings.blockPictures) && (settings.pictures_settings.page <= settings.pictures_settings.page_max)) {
    createPicturesPage(settings.sortedPictures);
  }
};
