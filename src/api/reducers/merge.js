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
                    emit(fld, dta);
                });
            }
            else {
                emit(field, dta);
            }
        });
};

module.exports.reduce = function (key, values) {
    var target = {}
        , length = values.length
        , name
        , i = 1
    ;
    for (; i < length; ++i) {
        if (values[i]) {
            for (name in values[i]) {
                if (target === values[i][name]) {
                    continue;
                }
                if (values[i][name] !== undefined) {
                    target[name] = values[i][name];
                }
            }
        }
    }
    return target;
};
