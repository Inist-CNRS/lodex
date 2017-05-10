/* eslint-disable */
//
// MongoDB JS functions
//

module.exports.map = function () {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    dta.uri = doc.uri;
    fields
        .filter(function(key) {
            return (dta[key] || doc[key]);
        })
        .map(function(key) {
            return dta[key] || doc[key];
        })
        .forEach(function(field) {
            if (field instanceof Array) {
                field.forEach(function (fld) {
                    emit(fld, 1);
                });
            }
            else {
                emit(field, 1);
            }
        });
};

module.exports.reduce = function (key, values) {
  return Array.sum(values);
};
