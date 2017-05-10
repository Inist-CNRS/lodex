/* eslint-disable */
//
// MongoDB JS functions
//

module.exports.map = function () {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    dta.uri = doc.uri;
    var values;
    if (fields.length === 1) {
        values = dta[fields[0]];
        if (values !== undefined) {
            if (!Array.isArray(values)) {
                values = [values];
            }
            values = values.sort().map(function(value) {
                var o = {};
                o[fields[0]] = value;
                return o;
            });
        }
    }
    else if (fields.length > 1) {
        values = fields
            .map(function(field) {
                var fieldValues = {};
                fieldValues[field] = dta[field];
                return fieldValues;
            })
            .reduce(function(previous, current) {
                var field = Object.keys(current)[0];
                if (Array.isArray(current[field])) {
                    current[field].sort().forEach(function (value) {
                        var o    = {};
                        o[field] = value;
                        previous.push(o);
                    });
                }
                else {
                    var o    = {};
                    o[field] = current[field];
                    previous.push(o);
                }
                return previous;
            }, []);
    }
    values
        .forEach(function(v, i) {
            values.slice(i + 1).forEach(function(w) {
                emit(JSON.stringify([v, w]), 1);
            });
        });
};

module.exports.reduce = function (key, values) {
    return Array.sum(values);
};
