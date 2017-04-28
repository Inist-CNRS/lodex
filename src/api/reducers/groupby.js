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
  var field = access(doc, exp[0]);
  if (field !== undefined) {
    if (field instanceof Array) {
      field.forEach(function (e) {
        if (typeof e === 'string') {
          e = e.trim();
        }
        emit(e, doc);
      });
    }
    else {
      emit(field, doc);
    }
  }
};

module.exports.reduce = function (key, values) {
  return { docs : values };
};

