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
                    emit(JSON.stringify([key, fld]), 1);
                });
            }
            else {
                // @ts-expect-error TS(2304): Cannot find name 'emit'.
                emit(JSON.stringify([key, field]), 1);
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
