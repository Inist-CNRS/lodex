/* eslint-disable */
//
// MongoDB JS functions
//

module.exports.map = function () {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    dta.uri = doc.uri;
    Object.keys(dta).forEach(function (key) {
      emit(key, 1);
    });
};

module.exports.reduce = function (key, values) {
  return Array.sum(values);
};
