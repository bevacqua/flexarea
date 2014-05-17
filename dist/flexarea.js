/**
 * flexarea - Pretty flexible textareas
 * @version v1.1.4
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

var insertRule = _dereq_('./insertRule');
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

},{"./insertRule":3}],3:[function(_dereq_,module,exports){
'use strict';

_dereq_('./object-keys');
_dereq_('./array-map');

var camel = /([a-z])([A-Z])/g;
var hyphens = '$1-$2';

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
module.exports = function (selector, styles) {
  var css = parseStyles(styles);
  var sheet = document.styleSheets[document.styleSheets.length - 1];
  var key = sheet.cssRules ? sheet.cssRules: sheet.rules;
  if (sheet.insertRule) {
    sheet.insertRule(selector + '{' + css + '}', key.length);
  } else if (sheet.addRule) {
    sheet.addRule(selector, css, key.length);
  }
};

},{"./array-map":1,"./object-keys":4}],4:[function(_dereq_,module,exports){
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbmljby9uaWNvL2dpdC9mbGV4YXJlYS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvZmxleGFyZWEvc3JjL2FycmF5LW1hcC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L2ZsZXhhcmVhL3NyYy9mbGV4YXJlYS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L2ZsZXhhcmVhL3NyYy9pbnNlcnRSdWxlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvZmxleGFyZWEvc3JjL29iamVjdC1rZXlzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaWYgKCFBcnJheS5wcm90b3R5cGUubWFwKSB7XG4gIEFycmF5LnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBpZiAodGhpcyA9PT0gdm9pZCAwIHx8IHRoaXMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICB9XG5cbiAgICB2YXIgdCA9IE9iamVjdCh0aGlzKTtcbiAgICB2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgIH1cblxuICAgIHZhciByZXMgPSBuZXcgQXJyYXkobGVuKTtcbiAgICB2YXIgY3R4ID0gYXJndW1lbnRzLmxlbmd0aCA+PSAyID8gYXJndW1lbnRzWzFdIDogdm9pZCAwO1xuICAgIHZhciBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKGkgaW4gdCkge1xuICAgICAgICByZXNbaV0gPSBmbi5jYWxsKGN0eCwgdFtpXSwgaSwgdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluc2VydFJ1bGUgPSByZXF1aXJlKCcuL2luc2VydFJ1bGUnKTtcbnZhciBkb2MgPSBkb2N1bWVudDtcbnZhciB1aWQgPSAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0ZXh0YXJlYSkge1xuICB2YXIgd3JhcHBlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIGdyaXAgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHZhciBtaW4gPSAzMjtcbiAgdmFyIG9mZnNldDtcbiAgdmFyIHBvc2l0aW9uO1xuICB2YXIgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGV4dGFyZWEpO1xuICB2YXIgZ2lkID0gJ2ZhLWdyaXAtJyArIHVpZCsrO1xuICB2YXIgZyA9ICcuJyArIGdpZDtcbiAgdmFyIGdyaXBTZWxlY3RvciA9IFtnLCBnICsgJzpiZWZvcmUnLCBnICsgJzphZnRlciddLmpvaW4oJywnKTtcblxuICB0ZXh0YXJlYS5jbGFzc0xpc3QuYWRkKCdmYS10ZXh0YXJlYScpO1xuICB0ZXh0YXJlYS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh3cmFwcGVyLCB0ZXh0YXJlYSk7XG4gIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGV4dGFyZWEpO1xuICB3cmFwcGVyLmFwcGVuZENoaWxkKGdyaXApO1xuICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2ZhLXdyYXBwZXInKTtcbiAgZ3JpcC5jbGFzc0xpc3QuYWRkKCdmYS1ncmlwJyk7XG4gIGdyaXAuY2xhc3NMaXN0LmFkZChnaWQpO1xuICBncmlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHN0YXJ0KTtcbiAgZ3JpcC5zdHlsZS5tYXJnaW5SaWdodCA9IChncmlwLm9mZnNldFdpZHRoIC0gdGV4dGFyZWEub2Zmc2V0V2lkdGgpICsgJ3B4JztcblxuICBpbnNlcnRSdWxlKGdyaXBTZWxlY3Rvciwge1xuICAgIGJhY2tncm91bmRDb2xvcjogc3R5bGVzLmJhY2tncm91bmRDb2xvcixcbiAgICBib3JkZXJDb2xvcjogc3R5bGVzLmJvcmRlckNvbG9yXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHN0YXJ0IChlKSB7XG4gICAgdGV4dGFyZWEuYmx1cigpO1xuICAgIHRleHRhcmVhLmNsYXNzTGlzdC5hZGQoJ2ZhLXRleHRhcmVhLXJlc2l6aW5nJyk7XG4gICAgcG9zaXRpb24gPSBnZXRQb3NpdGlvbihlKS55O1xuICAgIG9mZnNldCA9IHRleHRhcmVhLm9mZnNldEhlaWdodCAtIHBvc2l0aW9uO1xuICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlKTtcbiAgICBkb2MuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVuZCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gbW92ZSAoZSkge1xuICAgIHZhciBjdXJyZW50ID0gZ2V0UG9zaXRpb24oZSkueTtcbiAgICB2YXIgbW92ZWQgPSBvZmZzZXQgKyBjdXJyZW50O1xuICAgIGlmIChwb3NpdGlvbiA+PSBjdXJyZW50KSB7XG4gICAgICBtb3ZlZCAtPSA1O1xuICAgIH1cbiAgICBwb3NpdGlvbiA9IGN1cnJlbnQ7XG4gICAgbW92ZWQgPSBNYXRoLm1heChtaW4sIG1vdmVkKTtcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSBtb3ZlZCArICdweCc7XG4gICAgaWYgKG1vdmVkIDwgbWluKSB7XG4gICAgICBlbmQoZSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVuZCAoZSkge1xuICAgIGRvYy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlKTtcbiAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVuZCk7XG4gICAgdGV4dGFyZWEuY2xhc3NMaXN0LnJlbW92ZSgnZmEtdGV4dGFyZWEtcmVzaXppbmcnKTtcbiAgICB0ZXh0YXJlYS5mb2N1cygpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb24gKGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogZS5jbGllbnRYICsgZG9jLmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgICAgeTogZS5jbGllbnRZICsgZG9jLmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BcbiAgICB9O1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuL29iamVjdC1rZXlzJyk7XG5yZXF1aXJlKCcuL2FycmF5LW1hcCcpO1xuXG52YXIgY2FtZWwgPSAvKFthLXpdKShbQS1aXSkvZztcbnZhciBoeXBoZW5zID0gJyQxLSQyJztcblxuZnVuY3Rpb24gcGFyc2VTdHlsZXMgKHN0eWxlcykge1xuICBpZiAodHlwZW9mIHN0eWxlcyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3R5bGVzKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0eWxlcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgcHJvcCA9IGtleS5yZXBsYWNlKGNhbWVsLCBoeXBoZW5zKS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBwcm9wICsgJzonICsgc3R5bGVzW2tleV07XG4gIH0pLmpvaW4oJzsnKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBzdHlsZXMpIHtcbiAgdmFyIGNzcyA9IHBhcnNlU3R5bGVzKHN0eWxlcyk7XG4gIHZhciBzaGVldCA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW2RvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aCAtIDFdO1xuICB2YXIga2V5ID0gc2hlZXQuY3NzUnVsZXMgPyBzaGVldC5jc3NSdWxlczogc2hlZXQucnVsZXM7XG4gIGlmIChzaGVldC5pbnNlcnRSdWxlKSB7XG4gICAgc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvciArICd7JyArIGNzcyArICd9Jywga2V5Lmxlbmd0aCk7XG4gIH0gZWxzZSBpZiAoc2hlZXQuYWRkUnVsZSkge1xuICAgIHNoZWV0LmFkZFJ1bGUoc2VsZWN0b3IsIGNzcywga2V5Lmxlbmd0aCk7XG4gIH1cbn07XG4iLCJpZiAoIU9iamVjdC5rZXlzKSB7XG4gIE9iamVjdC5rZXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICB2YXIgaGFzRG9udEVudW1CdWcgPSAhKHt0b1N0cmluZzogbnVsbH0pLnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xuICAgIHZhciBkb250RW51bXMgPSBbXG4gICAgICAndG9TdHJpbmcnLFxuICAgICAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgICAgICd2YWx1ZU9mJyxcbiAgICAgICdoYXNPd25Qcm9wZXJ0eScsXG4gICAgICAnaXNQcm90b3R5cGVPZicsXG4gICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAgICAgJ2NvbnN0cnVjdG9yJ1xuICAgIF07XG4gICAgdmFyIGRvbnRFbnVtc0xlbmd0aCA9IGRvbnRFbnVtcy5sZW5ndGg7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICYmICh0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nIHx8IG9iaiA9PT0gbnVsbCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmtleXMgY2FsbGVkIG9uIG5vbi1vYmplY3QnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgdmFyIHByb3A7XG4gICAgICB2YXIgaTtcblxuICAgICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGhhc0RvbnRFbnVtQnVnKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkb250RW51bXNMZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgZG9udEVudW1zW2ldKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goZG9udEVudW1zW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfSgpKTtcbn1cbiJdfQ==
(2)
});
