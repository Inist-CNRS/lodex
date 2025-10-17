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
    fields
        .filter(function(key) {
            return (dta[key] || doc[key]);
        })
        .forEach(function(key) {
            var field = dta[key] || doc[key];
            if (field instanceof Array) {
                field.forEach(function (fld) {
                    emit(key, Number(fld));
                });
            }
            else {
                emit(key, Number(field));
            }
        });
}
`;

const reduce = /* js */ js`
function (key, values) {
    return values.reduce(function (a, b) { return a > b ? a : b; });
}
`;

const finalize = /* js */ js`
function finalize(key, value) {
    return value;
}
`;

const fieldname = function (name: any) {
    if (name === 'value') {
        return 'value';
    }
    return '_id';
};

export default {
    map,
    reduce,
    finalize,
    fieldname,
};
