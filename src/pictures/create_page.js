'use strict';

var parameters = require('./parameters');
var RenderedPicture = require('./render');
var utilites = require('./utilites');

function fillPage(pictures) {
  while (utilites.isBottomReached(parameters.blockPictures) && (parameters.pictures_settings.page <= parameters.pictures_settings.page_max)) {
    createPage(pictures);
  }
}
function createPage(pictures) {
  var from = (parameters.pictures_settings.page === 0) ? 0 : parameters.pictures_settings.page * parameters.pictures_settings.per_page + parameters.pictures_settings.offset;
  var to = (parameters.pictures_settings.page === 0) ? from + parameters.pictures_settings.first_page : from + parameters.pictures_settings.per_page;
  pictures.slice(from, to).forEach(function(picture) {
    parameters.renderedPictures.push(new RenderedPicture(picture));
  });
  parameters.pictures_settings.page++;
  fillPage(pictures);
}

// отрисовка "страницы" картинок
module.exports = createPage;
