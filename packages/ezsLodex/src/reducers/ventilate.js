/* eslint-disable */
import { js } from './template.js';

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

const fieldname = function (name) {
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
