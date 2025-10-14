/* eslint-disable */
import { js } from './template';

//
// MongoDB JS functions
//

//FIXME These functions are stringified to be passed to MongoDB.
// We do this to avoid transpilation issues when using TypeScript.
// As mapReduce is deprecated, you should probably use an aggregation pipeline instead.

const map = /* js */ js`
function () {
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
}
`;

const reduce = /* js */ js`
function (key, values) {
    return Array.sum(values);
}
`;

const finalize = /* js */ js`
function finalize(key, value) {
    var vector = JSON.parse(key);
    var obj = {
        source: vector[0],
        target: vector[1],
        weight: value,
    }
    return obj;
}
`;

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
