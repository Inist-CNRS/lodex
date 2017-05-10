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
                    var val = Number(fld);
                    emit(key, {
                        sum: val || 0,
                        min: val || 0,
                        max: val || 0,
                        count: 1,
                        diff: 0
                    });
                });
            }
            else {
                var val = Number(field);
                emit(key, {
                    sum: val || 0,
                    min: val || 0,
                    max: val || 0,
                    count: 1,
                    diff: 0
                });
            }
        });
};

module.exports.reduce = function reduce(key, values) {
    return values.reduce(function reduce(previous, current, index, array) {
        var delta = previous.sum / previous.count - current.sum / current.count;
        var weight = previous.count * current.count / (previous.count + current.count);

        return {
            sum: previous.sum + current.sum,
            min: Math.min(previous.min, current.min),
            max: Math.max(previous.max, current.max),
            count: previous.count + current.count,
            diff: previous.diff + current.diff + delta * delta * weight
        };
    });
};

module.exports.finalize = function finalize(key, value) {
    value.average = value.sum / value.count;
    value.populationVariance = value.diff / value.count;
    value.populationStandardDeviation = Math.sqrt(value.population_variance);
    value.sampleVariance = value.diff / (value.count - 1);
    value.sampleStandardDeviation = Math.sqrt(value.sample_variance);
    delete value.diff;
    return value;
};
