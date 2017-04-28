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
  var values
    , fields = exp;
  if (fields.length === 1) {
    values = access(doc, fields[0]);
    if (values !== undefined) {
      if (!Array.isArray(values)) {
        values = [values];
      }
      values = values.sort().map(function(value) {
        var o = {};
        o[fields[0]] = value;
        return o;
      });
    }
  }
  else if (fields.length > 1) {
    values = fields
    .map(function(field) {
      var fieldValues = {};
      fieldValues[field] = access(doc, field);
      return fieldValues;
    })
    .reduce(function(previous, current) {
      var field = Object.keys(current)[0];
      if (Array.isArray(current[field])) {
        current[field].sort().forEach(function (value) {
          var o    = {};
          o[field] = value;
          previous.push(o);
        });
      }
      else {
        var o    = {};
        o[field] = current[field];
        previous.push(o);
      }
      return previous;
    }, []);
  }
  // var seen = {};
  values
  // .filter(function(item) {
  //   return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  // })
  .forEach(function(v, i) {
    values.slice(i + 1).forEach(function(w) {
      emit(JSON.stringify([v, w]), 1);
    });
  });
};

module.exports.reduce = function (key, values) {
  return Array.sum(values);
};
