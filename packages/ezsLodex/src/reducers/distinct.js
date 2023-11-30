/* eslint-disable */
//
// MongoDB JS functions
//

module.exports.map = function () {
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

module.exports.reduce = function (key, values) {
    return Array.sum(values);
};

module.exports.finalize = function finalize(key, value) {
    return value;
};

module.exports.fieldname = function (name) {
    if (name === 'value') {
        return 'value';
    }
    return '_id';
};
