/* eslint-disable */
//
// MongoDB JS functions
//

const map = function(this: any) {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    dta.uri = doc.uri;
    // @ts-expect-error TS(2304): Cannot find name 'fields'.
    fields
        .filter(function(key: any) {
            return (dta[key] || doc[key]);
        })
        .forEach(function(key: any) {
            var field = dta[key] || doc[key];
            if (field instanceof Array) {
                field.forEach(function (fld) {
                    var val = Number(fld);
                    // @ts-expect-error TS(2304): Cannot find name 'emit'.
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
                // @ts-expect-error TS(2304): Cannot find name 'emit'.
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

// @ts-expect-error TS(6133): 'key' is declared but its value is never read.
const reduce = function reduce(key: any, values: any) {
    // @ts-expect-error TS(6133): 'index' is declared but its value is never read.
    return values.reduce(function reduce(previous: any, current: any, index: any, array: any) {
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

// @ts-expect-error TS(6133): 'key' is declared but its value is never read.
const finalize = function finalize(key: any, value: any) {
    value.average = value.sum / value.count;
    value.populationVariance = value.diff / value.count;
    value.populationStandardDeviation = Math.sqrt(value.population_variance);
    value.sampleVariance = value.diff / (value.count - 1);
    value.sampleStandardDeviation = Math.sqrt(value.sample_variance);
    delete value.diff;
    return value;
};


const fieldname = function (name: any) {
    if (name === 'value') {
        return 'value.count';
    }
    return '_id';
};

export default {
    map,
    reduce,
    finalize,
    fieldname,
};
