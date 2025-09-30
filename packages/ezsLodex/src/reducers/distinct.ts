/* eslint-disable */
//
// MongoDB JS functions
//

const map = function(this: any) {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    dta.uri = doc.uri;
    function send(data: any) {
        if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
            // @ts-expect-error TS(2304): Cannot find name 'emit'.
            emit(data, 1);
        } else {
            // @ts-expect-error TS(2304): Cannot find name 'emit'.
            emit(JSON.stringify(data), 1);
        }
    }
    // @ts-expect-error TS(2304): Cannot find name 'fields'.
    fields
        .filter(function(key: any) {
            return (dta[key] || doc[key]);
        })
        .map(function(key: any) {
            return dta[key] || doc[key];
        })
        .forEach(function(field: any) {
            if (Array.isArray(field)) {
                field.forEach(function (fld) {
                    send(fld);
                });
            }
            else {
                send(field);
            }
        });
};

// @ts-expect-error TS(6133): 'key' is declared but its value is never read.
const reduce = function (key: any, values: any) {
    // @ts-expect-error TS(2339): Property 'sum' does not exist on type 'ArrayConstr... Remove this comment to see the full error message
    return Array.sum(values);
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
