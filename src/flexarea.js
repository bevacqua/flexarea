'use strict';

var insertRule = require('./insertRule');
var doc = document;
var uid = 0;

  background-color: #f3f4eb;
  border-color: #dedede;

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
