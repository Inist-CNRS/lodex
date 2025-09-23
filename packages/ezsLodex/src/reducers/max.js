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
        .forEach(function(key) {
            var field = dta[key] || doc[key];
            if (field instanceof Array) {
                field.forEach(function (fld) {
                    emit(key, Number(fld));
                });
            }
            else {
                emit(key, Number(field));
            }
        });
};

const reduce = function (key, values) {
    return values.reduce(function (a, b) { return a > b ? a : b; });
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
