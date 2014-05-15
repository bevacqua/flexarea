/**
 * flexarea - Pretty flexible textareas
 * @version v1.0.22
 * @link https://github.com/bevacqua/flexarea
 * @license MIT
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.flexarea=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var doc = document;

module.exports = function (textarea) {
  var wrapper = doc.createElement('div');
  var grip = doc.createElement('div');
  var min = 32;
  var offset;
  var position;

  textarea.classList.add('fa-textarea');
  textarea.parentNode.replaceChild(wrapper, textarea);
  wrapper.appendChild(textarea);
  wrapper.appendChild(grip);
  wrapper.classList.add('fa-wrapper');
  grip.classList.add('fa-grip');
  grip.addEventListener('mousedown', start);
  grip.style.marginRight = (grip.offsetWidth - textarea.offsetWidth) + 'px';

  function start (e) {
    textarea.blur();
    textarea.classList.add('fa-textarea-resizing');
    position = getPosition(e).y;
    offset = textarea.style.height - position;
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJGOlxcZ2l0XFxmbGV4YXJlYVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJGOi9naXQvZmxleGFyZWEvc3JjL2ZsZXhhcmVhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgZG9jID0gZG9jdW1lbnQ7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0ZXh0YXJlYSkge1xyXG4gIHZhciB3cmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHZhciBncmlwID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHZhciBtaW4gPSAzMjtcclxuICB2YXIgb2Zmc2V0O1xyXG4gIHZhciBwb3NpdGlvbjtcclxuXHJcbiAgdGV4dGFyZWEuY2xhc3NMaXN0LmFkZCgnZmEtdGV4dGFyZWEnKTtcclxuICB0ZXh0YXJlYS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh3cmFwcGVyLCB0ZXh0YXJlYSk7XHJcbiAgd3JhcHBlci5hcHBlbmRDaGlsZCh0ZXh0YXJlYSk7XHJcbiAgd3JhcHBlci5hcHBlbmRDaGlsZChncmlwKTtcclxuICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2ZhLXdyYXBwZXInKTtcclxuICBncmlwLmNsYXNzTGlzdC5hZGQoJ2ZhLWdyaXAnKTtcclxuICBncmlwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHN0YXJ0KTtcclxuICBncmlwLnN0eWxlLm1hcmdpblJpZ2h0ID0gKGdyaXAub2Zmc2V0V2lkdGggLSB0ZXh0YXJlYS5vZmZzZXRXaWR0aCkgKyAncHgnO1xyXG5cclxuICBmdW5jdGlvbiBzdGFydCAoZSkge1xyXG4gICAgdGV4dGFyZWEuYmx1cigpO1xyXG4gICAgdGV4dGFyZWEuY2xhc3NMaXN0LmFkZCgnZmEtdGV4dGFyZWEtcmVzaXppbmcnKTtcclxuICAgIHBvc2l0aW9uID0gZ2V0UG9zaXRpb24oZSkueTtcclxuICAgIG9mZnNldCA9IHRleHRhcmVhLnN0eWxlLmhlaWdodCAtIHBvc2l0aW9uO1xyXG4gICAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmUpO1xyXG4gICAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbmQpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW92ZSAoZSkge1xyXG4gICAgdmFyIGN1cnJlbnQgPSBnZXRQb3NpdGlvbihlKS55O1xyXG4gICAgdmFyIG1vdmVkID0gb2Zmc2V0ICsgY3VycmVudDtcclxuICAgIGlmIChwb3NpdGlvbiA+PSBjdXJyZW50KSB7XHJcbiAgICAgIG1vdmVkIC09IDU7XHJcbiAgICB9XHJcbiAgICBwb3NpdGlvbiA9IGN1cnJlbnQ7XHJcbiAgICBtb3ZlZCA9IE1hdGgubWF4KG1pbiwgbW92ZWQpO1xyXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gbW92ZWQgKyAncHgnO1xyXG4gICAgaWYgKG1vdmVkIDwgbWluKSB7XHJcbiAgICAgIGVuZChlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGVuZCAoZSkge1xyXG4gICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmUpO1xyXG4gICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbmQpO1xyXG4gICAgdGV4dGFyZWEuY2xhc3NMaXN0LnJlbW92ZSgnZmEtdGV4dGFyZWEtcmVzaXppbmcnKTtcclxuICAgIHRleHRhcmVhLmZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXRQb3NpdGlvbiAoZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogZS5jbGllbnRYICsgZG9jLmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxyXG4gICAgICB5OiBlLmNsaWVudFkgKyBkb2MuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxyXG4gICAgfTtcclxuICB9XHJcbn07XHJcbiJdfQ==
(1)
});
