'use strict';

function DomConstructor() {
}
DomConstructor.prototype.add = function(element, container) {
  container.appendChild(element);
};
DomConstructor.prototype.remove = function(element, container) {
  container.removeChild(element);
};

module.exports = DomConstructor;
