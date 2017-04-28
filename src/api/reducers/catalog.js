'use strict';


module.exports.map = function () {
  /* global exp, emit */
  var doc = this
    , sel = exp[0]
    , invert = sel[0] === '-'
    , res = {};
  if (invert) {
    sel = sel.slice(1);
  }
  function browse(obj, prefix) {
    if (prefix) {
      prefix += '.';
    }
    else {
      prefix = '';
    }

    Object.keys(obj)
    .forEach(function (prop) {
      var key = prefix
        , value = obj[prop];
      key += isNaN(parseInt(prop)) ? prop : '0';
      if (typeof value === 'object' &&
        prop !== '_id' &&
        !(value instanceof Date)) {
        browse(value, key);
      }
      else {
        if (sel === '*') {
          res[key] = true;
        }
        if (key.indexOf(sel) === 0 && invert === false) {
          res[key] = true;
        }
        else if (key.indexOf(sel) !== 0 && invert === true) {
          res[key] = true;
        }
      }
    });
  }
  browse(doc);
  Object.keys(res).forEach(function(i) {
    emit(i, 1);
  });
};

module.exports.reduce = function (key, values) {
  return Array.sum(values);
};
