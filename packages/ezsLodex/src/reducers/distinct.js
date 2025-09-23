/* eslint-disable */
//
// MongoDB JS functions
//

const map = function () {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    dta.uri = doc.uri;
    function send(data) {
        if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
            emit(data, 1);
        } else {
            emit(JSON.stringify(data), 1);
        }
    }
    fields
        .filter(function(key) {
            return (dta[key] || doc[key]);
        })
        .map(function(key) {
            return dta[key] || doc[key];
        })
        .forEach(function(field) {
            if (Array.isArray(field)) {
                field.forEach(function (fld) {
                    send(fld);
                });
            }
            else {
                send(field);
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
