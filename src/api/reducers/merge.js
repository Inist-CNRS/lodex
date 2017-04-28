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

  var target = {}
    , length = values.length
    , name
    , i = 1
    ;
  for (; i < length; ++i) {
    if (values[i]) {
      for (name in values[i]) {
        if (target === values[i][name]) {
          continue;
        }
        if (values[i][name] !== undefined) {
          target[name] = values[i][name];
        }
      }
    }
  }
  return target;
};

