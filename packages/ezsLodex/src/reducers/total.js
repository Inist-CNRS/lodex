/* eslint-disable */
//
// MongoDB JS functions :  to sum all values from a field
//

const map = function () {
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

const reduce = function (key, values) {
  return Array.sum(values);
};

const finalize = function finalize(key, value) {
    return value;
};

const fieldname = function (name) {
    if (name === 'value') {
        return 'value';
    }
    return '_id';
};

export default {
    map,
    reduce,
    finalize,
    fieldname,
};
