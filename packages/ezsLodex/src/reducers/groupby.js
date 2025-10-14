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
}
`;

const reduce = /* js */ js`
function (key, values) {
    return { docs: values };
}
`;

const finalize = /* js */ js`
function finalize(key, value) {
    return value;
}
`;

const fieldname = function (name) {
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
