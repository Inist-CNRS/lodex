/* eslint-disable */
//
// MongoDB JS functions
//

module.exports.map = function () {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    dta.uri = doc.uri;
    var values = fields.map(function(field) {
        var value = dta[field];
        if (value !== undefined) {
            if (!Array.isArray(value)) {
                value = [value];
            }
        }
        return value;
    });
    values
        .forEach(function(v, i) {
            var allValues = values.slice(i + 1).reduce(function(previous, current) {
                current.forEach(function(val) {
                    previous.push(val);
                });
                return previous;
            }, []);
            if (allValues) {
                v.forEach(function(w) {
                    allValues.forEach(function(x) {
                        emit(JSON.stringify([w, x]), 1);
                    });
                })
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
