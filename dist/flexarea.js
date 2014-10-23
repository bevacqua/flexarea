/**
 * flexarea - Pretty flexible textareas
 * @version v1.3.0
 * @link https://github.com/bevacqua/flexarea
 * @license MIT
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.flexarea=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
if (!Array.prototype.map) {
  Array.prototype.map = function (fn) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fn !== 'function') {
      throw new TypeError();
    }

    var res = new Array(len);
    var ctx = arguments.length >= 2 ? arguments[1] : void 0;
    var i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        res[i] = fn.call(ctx, t[i], i, t);
      }
    }

    return res;
  };
}

},{}],2:[function(_dereq_,module,exports){
'use strict';

_dereq_('./object-keys');
_dereq_('./array-map');

var camel = /([a-z])([A-Z])/g;
var hyphens = '$1-$2';
var contexts = {};

function parseStyles (styles) {
  if (typeof styles === 'string') {
    return styles;
  }
  if (Object.prototype.toString.call(styles) !== '[object Object]') {
    return '';
  }
  return Object.keys(styles).map(function (key) {
    var prop = key.replace(camel, hyphens).toLowerCase();
    return prop + ':' + styles[key];
  }).join(';');
}

function context (name) {
  if (contexts[name]) {
    return contexts[name];
  }
  var cache;
  var rules;
  var remove;

  function getStylesheet () {
    if (cache) {
      return cache;
    }
    var style = document.createElement('style');
    document.body.appendChild(style);
    style.setAttribute('data-context', name);
    cache = document.styleSheets[document.styleSheets.length - 1];
    rules = cache.cssRules ? 'cssRules' : 'rules';
    remove = cache.removeRule ? 'removeRule' : 'deleteRule';
    return cache;
  }

  function add (selector, styles) {
    var css = parseStyles(styles);
    var sheet = getStylesheet();
    var len = sheet[rules].length;
    if (sheet.insertRule) {
      sheet.insertRule(selector + '{' + css + '}', len);
    } else if (sheet.addRule) {
      sheet.addRule(selector, css, len);
    }
  }

  function remove (selector) {
    var sheet = getStylesheet();
    var length = sheet[rules].length;
    var i;
    for (i = length - 1; i >= 0; i--) {
      if (sheet[rules][i].selectorText === selector) {
        sheet[remove](i);
      }
    }
  }

  function clear () {
    var sheet = getStylesheet();
    while (sheet[rules].length) {
      sheet[remove](0);
    }
  }

  add.clear = clear;
  add.remove = remove;
  contexts[name] = add;
  return contexts[name];
}

var ctx = context('default');
ctx.context = context;
module.exports = ctx;

},{"./array-map":1,"./object-keys":3}],3:[function(_dereq_,module,exports){
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString');
    var dontEnums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ];
    var dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [];
      var prop;
      var i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

},{}],4:[function(_dereq_,module,exports){
'use strict';

var insertRule = _dereq_('insert-rule');
var doc = document;
var uid = 0;

module.exports = function (textarea) {
  var wrapper = doc.createElement('div');
  var grip = doc.createElement('div');
  var min = 32;
  var offset;
  var position;
  var styles = window.getComputedStyle(textarea);
  var gid = 'fa-grip-' + uid++;
  var g = '.' + gid;
  var gripSelector = [g, g + ':before', g + ':after'].join(',');

  textarea.classList.add('fa-textarea');
  textarea.parentNode.replaceChild(wrapper, textarea);
  wrapper.appendChild(textarea);
  wrapper.appendChild(grip);
  wrapper.classList.add('fa-wrapper');
  grip.classList.add('fa-grip');
  grip.classList.add(gid);
  grip.addEventListener('mousedown', start);
  grip.style.marginRight = (grip.offsetWidth - textarea.offsetWidth) + 'px';

  insertRule(gripSelector, {
    backgroundColor: styles.backgroundColor,
    borderColor: styles.borderColor
  });

  function start (e) {
    textarea.blur();
    textarea.classList.add('fa-textarea-resizing');
    position = getPosition(e).y;
    offset = textarea.offsetHeight - position;
    doc.addEventListener('mousemove', move);
    doc.addEventListener('mouseup', end);
    return false;
  }

  function move (e) {
    var current = getPosition(e).y;
    var moved = offset + current;
    if (position >= current) {
      moved -= 5;
    }
    position = current;
    moved = Math.max(min, moved);
    textarea.style.height = moved + 'px';
    if (moved < min) {
      end(e);
    }
    return false;
  }

  function end (e) {
    doc.removeEventListener('mousemove', move);
    doc.removeEventListener('mouseup', end);
    textarea.classList.remove('fa-textarea-resizing');
    textarea.focus();
  }

  function getPosition (e) {
    return {
      x: e.clientX + doc.documentElement.scrollLeft,
      y: e.clientY + doc.documentElement.scrollTop
    };
  }
};

},{"insert-rule":2}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbmljby9uaWNvL2dpdC9mbGV4YXJlYS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvZmxleGFyZWEvbm9kZV9tb2R1bGVzL2luc2VydC1ydWxlL3NyYy9hcnJheS1tYXAuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9mbGV4YXJlYS9ub2RlX21vZHVsZXMvaW5zZXJ0LXJ1bGUvc3JjL2luc2VydFJ1bGUuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9mbGV4YXJlYS9ub2RlX21vZHVsZXMvaW5zZXJ0LXJ1bGUvc3JjL29iamVjdC1rZXlzLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvZmxleGFyZWEvc3JjL2ZsZXhhcmVhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaWYgKCFBcnJheS5wcm90b3R5cGUubWFwKSB7XG4gIEFycmF5LnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBpZiAodGhpcyA9PT0gdm9pZCAwIHx8IHRoaXMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICB9XG5cbiAgICB2YXIgdCA9IE9iamVjdCh0aGlzKTtcbiAgICB2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgIH1cblxuICAgIHZhciByZXMgPSBuZXcgQXJyYXkobGVuKTtcbiAgICB2YXIgY3R4ID0gYXJndW1lbnRzLmxlbmd0aCA+PSAyID8gYXJndW1lbnRzWzFdIDogdm9pZCAwO1xuICAgIHZhciBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKGkgaW4gdCkge1xuICAgICAgICByZXNbaV0gPSBmbi5jYWxsKGN0eCwgdFtpXSwgaSwgdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9vYmplY3Qta2V5cycpO1xucmVxdWlyZSgnLi9hcnJheS1tYXAnKTtcblxudmFyIGNhbWVsID0gLyhbYS16XSkoW0EtWl0pL2c7XG52YXIgaHlwaGVucyA9ICckMS0kMic7XG52YXIgY29udGV4dHMgPSB7fTtcblxuZnVuY3Rpb24gcGFyc2VTdHlsZXMgKHN0eWxlcykge1xuICBpZiAodHlwZW9mIHN0eWxlcyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3R5bGVzKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0eWxlcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgcHJvcCA9IGtleS5yZXBsYWNlKGNhbWVsLCBoeXBoZW5zKS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBwcm9wICsgJzonICsgc3R5bGVzW2tleV07XG4gIH0pLmpvaW4oJzsnKTtcbn1cblxuZnVuY3Rpb24gY29udGV4dCAobmFtZSkge1xuICBpZiAoY29udGV4dHNbbmFtZV0pIHtcbiAgICByZXR1cm4gY29udGV4dHNbbmFtZV07XG4gIH1cbiAgdmFyIGNhY2hlO1xuICB2YXIgcnVsZXM7XG4gIHZhciByZW1vdmU7XG5cbiAgZnVuY3Rpb24gZ2V0U3R5bGVzaGVldCAoKSB7XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICByZXR1cm4gY2FjaGU7XG4gICAgfVxuICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgc3R5bGUuc2V0QXR0cmlidXRlKCdkYXRhLWNvbnRleHQnLCBuYW1lKTtcbiAgICBjYWNoZSA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW2RvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aCAtIDFdO1xuICAgIHJ1bGVzID0gY2FjaGUuY3NzUnVsZXMgPyAnY3NzUnVsZXMnIDogJ3J1bGVzJztcbiAgICByZW1vdmUgPSBjYWNoZS5yZW1vdmVSdWxlID8gJ3JlbW92ZVJ1bGUnIDogJ2RlbGV0ZVJ1bGUnO1xuICAgIHJldHVybiBjYWNoZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZCAoc2VsZWN0b3IsIHN0eWxlcykge1xuICAgIHZhciBjc3MgPSBwYXJzZVN0eWxlcyhzdHlsZXMpO1xuICAgIHZhciBzaGVldCA9IGdldFN0eWxlc2hlZXQoKTtcbiAgICB2YXIgbGVuID0gc2hlZXRbcnVsZXNdLmxlbmd0aDtcbiAgICBpZiAoc2hlZXQuaW5zZXJ0UnVsZSkge1xuICAgICAgc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvciArICd7JyArIGNzcyArICd9JywgbGVuKTtcbiAgICB9IGVsc2UgaWYgKHNoZWV0LmFkZFJ1bGUpIHtcbiAgICAgIHNoZWV0LmFkZFJ1bGUoc2VsZWN0b3IsIGNzcywgbGVuKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmUgKHNlbGVjdG9yKSB7XG4gICAgdmFyIHNoZWV0ID0gZ2V0U3R5bGVzaGVldCgpO1xuICAgIHZhciBsZW5ndGggPSBzaGVldFtydWxlc10ubGVuZ3RoO1xuICAgIHZhciBpO1xuICAgIGZvciAoaSA9IGxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAoc2hlZXRbcnVsZXNdW2ldLnNlbGVjdG9yVGV4dCA9PT0gc2VsZWN0b3IpIHtcbiAgICAgICAgc2hlZXRbcmVtb3ZlXShpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhciAoKSB7XG4gICAgdmFyIHNoZWV0ID0gZ2V0U3R5bGVzaGVldCgpO1xuICAgIHdoaWxlIChzaGVldFtydWxlc10ubGVuZ3RoKSB7XG4gICAgICBzaGVldFtyZW1vdmVdKDApO1xuICAgIH1cbiAgfVxuXG4gIGFkZC5jbGVhciA9IGNsZWFyO1xuICBhZGQucmVtb3ZlID0gcmVtb3ZlO1xuICBjb250ZXh0c1tuYW1lXSA9IGFkZDtcbiAgcmV0dXJuIGNvbnRleHRzW25hbWVdO1xufVxuXG52YXIgY3R4ID0gY29udGV4dCgnZGVmYXVsdCcpO1xuY3R4LmNvbnRleHQgPSBjb250ZXh0O1xubW9kdWxlLmV4cG9ydHMgPSBjdHg7XG4iLCJpZiAoIU9iamVjdC5rZXlzKSB7XG4gIE9iamVjdC5rZXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICB2YXIgaGFzRG9udEVudW1CdWcgPSAhKHt0b1N0cmluZzogbnVsbH0pLnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xuICAgIHZhciBkb250RW51bXMgPSBbXG4gICAgICAndG9TdHJpbmcnLFxuICAgICAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgICAgICd2YWx1ZU9mJyxcbiAgICAgICdoYXNPd25Qcm9wZXJ0eScsXG4gICAgICAnaXNQcm90b3R5cGVPZicsXG4gICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAgICAgJ2NvbnN0cnVjdG9yJ1xuICAgIF07XG4gICAgdmFyIGRvbnRFbnVtc0xlbmd0aCA9IGRvbnRFbnVtcy5sZW5ndGg7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICYmICh0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nIHx8IG9iaiA9PT0gbnVsbCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmtleXMgY2FsbGVkIG9uIG5vbi1vYmplY3QnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgdmFyIHByb3A7XG4gICAgICB2YXIgaTtcblxuICAgICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGhhc0RvbnRFbnVtQnVnKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkb250RW51bXNMZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgZG9udEVudW1zW2ldKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goZG9udEVudW1zW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfSgpKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluc2VydFJ1bGUgPSByZXF1aXJlKCdpbnNlcnQtcnVsZScpO1xudmFyIGRvYyA9IGRvY3VtZW50O1xudmFyIHVpZCA9IDA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRleHRhcmVhKSB7XG4gIHZhciB3cmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2YXIgZ3JpcCA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIG1pbiA9IDMyO1xuICB2YXIgb2Zmc2V0O1xuICB2YXIgcG9zaXRpb247XG4gIHZhciBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0ZXh0YXJlYSk7XG4gIHZhciBnaWQgPSAnZmEtZ3JpcC0nICsgdWlkKys7XG4gIHZhciBnID0gJy4nICsgZ2lkO1xuICB2YXIgZ3JpcFNlbGVjdG9yID0gW2csIGcgKyAnOmJlZm9yZScsIGcgKyAnOmFmdGVyJ10uam9pbignLCcpO1xuXG4gIHRleHRhcmVhLmNsYXNzTGlzdC5hZGQoJ2ZhLXRleHRhcmVhJyk7XG4gIHRleHRhcmVhLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHdyYXBwZXIsIHRleHRhcmVhKTtcbiAgd3JhcHBlci5hcHBlbmRDaGlsZCh0ZXh0YXJlYSk7XG4gIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZ3JpcCk7XG4gIHdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnZmEtd3JhcHBlcicpO1xuICBncmlwLmNsYXNzTGlzdC5hZGQoJ2ZhLWdyaXAnKTtcbiAgZ3JpcC5jbGFzc0xpc3QuYWRkKGdpZCk7XG4gIGdyaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc3RhcnQpO1xuICBncmlwLnN0eWxlLm1hcmdpblJpZ2h0ID0gKGdyaXAub2Zmc2V0V2lkdGggLSB0ZXh0YXJlYS5vZmZzZXRXaWR0aCkgKyAncHgnO1xuXG4gIGluc2VydFJ1bGUoZ3JpcFNlbGVjdG9yLCB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBzdHlsZXMuYmFja2dyb3VuZENvbG9yLFxuICAgIGJvcmRlckNvbG9yOiBzdHlsZXMuYm9yZGVyQ29sb3JcbiAgfSk7XG5cbiAgZnVuY3Rpb24gc3RhcnQgKGUpIHtcbiAgICB0ZXh0YXJlYS5ibHVyKCk7XG4gICAgdGV4dGFyZWEuY2xhc3NMaXN0LmFkZCgnZmEtdGV4dGFyZWEtcmVzaXppbmcnKTtcbiAgICBwb3NpdGlvbiA9IGdldFBvc2l0aW9uKGUpLnk7XG4gICAgb2Zmc2V0ID0gdGV4dGFyZWEub2Zmc2V0SGVpZ2h0IC0gcG9zaXRpb247XG4gICAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmUpO1xuICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZW5kKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBtb3ZlIChlKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBnZXRQb3NpdGlvbihlKS55O1xuICAgIHZhciBtb3ZlZCA9IG9mZnNldCArIGN1cnJlbnQ7XG4gICAgaWYgKHBvc2l0aW9uID49IGN1cnJlbnQpIHtcbiAgICAgIG1vdmVkIC09IDU7XG4gICAgfVxuICAgIHBvc2l0aW9uID0gY3VycmVudDtcbiAgICBtb3ZlZCA9IE1hdGgubWF4KG1pbiwgbW92ZWQpO1xuICAgIHRleHRhcmVhLnN0eWxlLmhlaWdodCA9IG1vdmVkICsgJ3B4JztcbiAgICBpZiAobW92ZWQgPCBtaW4pIHtcbiAgICAgIGVuZChlKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZW5kIChlKSB7XG4gICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmUpO1xuICAgIGRvYy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZW5kKTtcbiAgICB0ZXh0YXJlYS5jbGFzc0xpc3QucmVtb3ZlKCdmYS10ZXh0YXJlYS1yZXNpemluZycpO1xuICAgIHRleHRhcmVhLmZvY3VzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3NpdGlvbiAoZSkge1xuICAgIHJldHVybiB7XG4gICAgICB4OiBlLmNsaWVudFggKyBkb2MuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXG4gICAgICB5OiBlLmNsaWVudFkgKyBkb2MuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxuICAgIH07XG4gIH1cbn07XG4iXX0=
(4)
});
