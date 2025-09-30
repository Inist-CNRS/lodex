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
                    // @ts-expect-error TS(2304): Cannot find name 'emit'.
                    emit(key, Number(fld));
                });
            }
            else {
                // @ts-expect-error TS(2304): Cannot find name 'emit'.
                emit(key, Number(field));
            }
        });
};

// @ts-expect-error TS(6133): 'key' is declared but its value is never read.
const reduce = function (key: any, values: any) {
    return values.reduce(function (a: any, b: any) { return a < b ? a : b; });
};

// @ts-expect-error TS(6133): 'key' is declared but its value is never read.
const finalize = function finalize(key: any, value: any) {
    return value;
};

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
