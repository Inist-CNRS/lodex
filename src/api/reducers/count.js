/* eslint-disable */
//
// MongoDB JS functions
//

module.exports.map = function () {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    fields.forEach(function(key) {
        if (dta[key] || doc[key]) {
            emit(key, 1);
        }
    });
};

module.exports.reduce = function (key, values) {
  return Array.sum(values);
};
