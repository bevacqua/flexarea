'use strict';

require('./object-keys');
require('./array-map');

var camel = /([a-z])([A-Z])/g;
var hyphens = '$1-$2';

function parseStyles (styles) {
  if (typeof styles === 'string') {
    return styles;
  }
  if (Object.prototype.toString.call(styles) !== '[object Object]') {
    return '';
  }
  return Object.keys(styles).map(function (value, key) {
    var prop = key.replace(camel, hyphens).toLowerCase();
    return prop + ':' + value;
  }).join(';');
}
module.exports = function (selector, styles) {
  var css = parseStyles(styles);
  var sheet = document.styleSheets[document.styleSheets.length - 1];
  var key = sheet.cssRules ? sheet.cssRules: sheet.rules;
  if (sheet.insertRule) {
    sheet.insertRule(sel + '{' + css + '}', key.length);
  } else if (sheet.addRule) {
    sheet.addRule(sel, css, key.length);
  }
};
