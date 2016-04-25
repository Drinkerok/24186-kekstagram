'use strict';
var load = require('./load');
var settings = require('./parameters');
var createPage = require('./create_page');
var filter = require('./filter');










// window.addEventListener('resize', function() {
//   if (getComputedStyle(settings.blockPictures).width !== settings.container) {
//     settings.setParameters(settings.pictures);
//     settings.renderedPictures.forEach(function(picture){
//       picture.remove();
//     });
//     settings.renderedPictures = [];
//     // settings.pictures_settings.page = 0;
//     createPage.createPicturesPage(settings.sortedPictures);
//   }
// });
