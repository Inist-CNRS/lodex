/* eslint-disable */
//
// MongoDB JS functions
//

const map = function(this: any) {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    dta.uri = doc.uri;
    // @ts-expect-error TS(2304): Cannot find name 'fields'.
    var values = fields.map(function(field: any) {
        var value = dta[field];
        if (value !== undefined) {
            if (!Array.isArray(value)) {
                value = [value];
            }
        }
        return value;
    });
    values
        .forEach(function(v: any, i: any) {
            var allValues = values.slice(i + 1).reduce(function(previous: any, current: any) {
                current.forEach(function(val: any) {
                    previous.push(val);
                });
                return previous;
            }, []);
            if (allValues) {
                v.forEach(function(w: any) {
                    allValues.forEach(function(x: any) {
                        // @ts-expect-error TS(2304): Cannot find name 'emit'.
                        emit(JSON.stringify([w, x]), 1);
                    });
                })
            }
        });
};

// @ts-expect-error TS(6133): 'key' is declared but its value is never read.
const reduce = function (key: any, values: any) {
    // @ts-expect-error TS(2339): Property 'sum' does not exist on type 'ArrayConstr... Remove this comment to see the full error message
    return Array.sum(values);
};


const finalize = function finalize(key: any, value: any) {
    var vector = JSON.parse(key);
    var obj = {
        source: vector[0],
        target: vector[1],
        weight: value,
    }
    return obj;
};

const fieldname = function (name: any) {
    if (name === 'value') {
        return 'value.weight';
    }
    if (name === 'label') {
        return 'value.source';
    }
    return '_id';
};

export default {
    map,
    reduce,
    finalize,
    fieldname,
};
