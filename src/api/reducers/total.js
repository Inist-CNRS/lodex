/* eslint-disable */
//
// MongoDB JS functions :  to sum all values from a field
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
            return { key: key, val: dta[key] || doc[key] };
        })
        .forEach(function(item) {
            var key = item.key;
            var val = item.val;
            if (Array.isArray(val)) {
                val.forEach(function (v) {
                    emit(key, Number(v));
                });
            }
            else {
                emit(key, Number(val));
            }
        });
};

module.exports.reduce = function (key, values) {
  return Array.sum(values);
};
