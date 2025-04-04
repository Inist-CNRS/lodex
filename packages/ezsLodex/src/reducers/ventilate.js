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
        .forEach(function(key) {
            var field = dta[key] || doc[key];
            if (field instanceof Array) {
                field.forEach(function (fld) {
                    emit(JSON.stringify([key, fld]), 1);
                });
            }
            else {
                emit(JSON.stringify([key, field]), 1);
            }
        });
};

module.exports.reduce = function (key, values) {
    return Array.sum(values);
};

module.exports.finalize = function finalize(key, value) {
    var vector = JSON.parse(key);
    var obj = {
        source: vector[0],
        target: vector[1],
        weight: value,
    }
    return obj;
};

module.exports.fieldname = function (name) {
    if (name === 'value') {
        return 'value.weight';
    }
    if (name === 'label') {
        return 'value.source';
    }
    return '_id';
};
