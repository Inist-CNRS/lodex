/* eslint-disable */
//
// MongoDB JS functions
//

const map = function () {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    dta.uri = doc.uri;
    fields
        .filter(function(key) {
            return (dta[key] || doc[key]);
        })
        .forEach(function(field) {
            emit(field, 1);
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
