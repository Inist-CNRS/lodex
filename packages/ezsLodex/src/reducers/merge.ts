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
        .map(function(key: any) {
            return dta[key] || doc[key];
        })
        .forEach(function(field: any) {
            if (field instanceof Array) {
                field.forEach(function (fld) {
                    // @ts-expect-error TS(2304): Cannot find name 'emit'.
                    emit(fld, dta);
                });
            }
            else {
                // @ts-expect-error TS(2304): Cannot find name 'emit'.
                emit(field, dta);
            }
        });
};

// @ts-expect-error TS(6133): 'key' is declared but its value is never read.
const reduce = function (key: any, values: any) {
    var target = {}
        , length = values.length
        , name
        , i = 1
    ;
    for (; i < length; ++i) {
        if (values[i]) {
            for (name in values[i]) {
                if (target === values[i][name]) {
                    continue;
                }
                if (values[i][name] !== undefined) {
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    target[name] = values[i][name];
                }
            }
        }
    }
    return target;
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
