'use strict';

var parameters = require('./parameters');
var render = require('./render');

// отрисовка "страницы" картинок
module.exports = {
  createPicturesPage: function(pictures) {
    var from = (parameters.pictures_settings.page === 0) ? 0 : parameters.pictures_settings.page * parameters.pictures_settings.per_page + parameters.pictures_settings.offset;
    var to = (parameters.pictures_settings.page === 0) ? from + parameters.pictures_settings.first_page : from + parameters.pictures_settings.per_page;
    pictures.slice(from, to).forEach(function(picture) {
      parameters.renderedPictures.push(new render.RenderedPicture(picture));
    });
    parameters.pictures_settings.page++;
  }
};
