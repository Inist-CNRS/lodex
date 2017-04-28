/* global exp, emit */
'use strict';


module.exports.map = function map() {
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
    emit(1, {
      sum: field,
      min: field,
      max: field,
      count: 1,
      diff: 0
    });
  }
};

module.exports.reduce = function reduce(key, values) {
  return values.reduce(function reduce(previous, current, index, array) {
    var delta = previous.sum / previous.count - current.sum / current.count;
    var weight = previous.count * current.count / (previous.count + current.count);

    return {
      sum: previous.sum + current.sum,
      min: Math.min(previous.min, current.min),
      max: Math.max(previous.max, current.max),
      count: previous.count + current.count,
      diff: previous.diff + current.diff + delta * delta * weight
    };
  });
};

module.exports.finalize = function finalize(key, value) {
  value.average = value.sum / value.count;
  value.populationVariance = value.diff / value.count;
  value.populationStandardDeviation = Math.sqrt(value.population_variance);
  value.sampleVariance = value.diff / (value.count - 1);
  value.sampleStandardDeviation = Math.sqrt(value.sample_variance);
  delete value.diff;
  return value;
};
