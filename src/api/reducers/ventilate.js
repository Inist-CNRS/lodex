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
