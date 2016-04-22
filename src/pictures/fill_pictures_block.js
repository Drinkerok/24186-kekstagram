'use strict';

var utilites = require('./utilites');
var settings = require('./parameters');
var loaded = require('./load');
var createPage = require('./create_page');

module.exports = {
  fillPicturesBlock: function(pictures){
    while (utilites.isBottomReached(settings.blockPictures) && (settings.pictures_settings.page <= settings.pictures_settings.page_max)) {
      createPage.createPicturesPage(loaded.sortedPictures);
    }
  }
}
