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
        .map(function(key) {
            return dta[key] || doc[key];
        })
        .forEach(function(field) {
            if (field instanceof Array) {
                field.forEach(function (fld) {
                    emit(fld, dta);
                });
            }
            else {
                emit(field, dta);
            }
        });
};

const reduce = function (key, values) {
    return { docs: values };
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
