'use strict';

module.exports.map = function () {
  /* global exp, emit */
  var doc = this;
  function access(obj, prop) {
    var segs = prop.split('.');
    while (segs.length) {
      var k = segs.shift();
      if (obj[k]) {
        obj = obj[k];
      }
      else {
        obj = undefined;
      }
    }
    return obj;
  }
  if (exp[0]) {
    var field = access(doc, exp[0]);
    if (field !== undefined && typeof field === 'object') {
      Object.keys(field).forEach(function (k) {
        emit(k, 1);
      });
    }
    else {
      emit(exp[0], -1);
    }
  }
  else {
    Object.keys(doc).forEach(function (k) {
      emit(k, 1);
    });
  }
};

module.exports.reduce = function (key, values) {
  var s = Array.sum(values);
  return s > 0 ? s : -1;
};

