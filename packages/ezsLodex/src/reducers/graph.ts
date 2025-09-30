/* eslint-disable */
//
// MongoDB JS functions
//

const map = function(this: any) {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    dta.uri = doc.uri;
    var values: any = [];
    // @ts-expect-error TS(2304): Cannot find name 'fields'.
    if (fields.length === 1) {
        // @ts-expect-error TS(2304): Cannot find name 'fields'.
        values = dta[fields[0]];
        if (values !== undefined) {
            if (!Array.isArray(values)) {
                values = [values];
            }
            values = values.sort().map(function(value: any) {
                var o = {};
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                o[fields[0]] = value;
                return o;
            });
        }
    }
    // @ts-expect-error TS(2304): Cannot find name 'fields'.
    else if (fields.length > 1) {
        // @ts-expect-error TS(2304): Cannot find name 'fields'.
        values = fields
            .map(function(field: any) {
                var fieldValues = {};
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                fieldValues[field] = dta[field];
                return fieldValues;
            })
            .reduce(function(previous: any, current: any) {
                var field = Object.keys(current)[0];
                if (Array.isArray(current[field])) {
                    current[field].sort().forEach(function (value: any) {
                        var o    = {};
                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                        o[field] = value;
                        previous.push(o);
                    });
                }
                else {
                    var o    = {};
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    o[field] = current[field];
                    previous.push(o);
                }
                return previous;
            }, []);
    }
    values
        .forEach(function(v: any, i: any) {
            values.slice(i + 1).forEach(function(w: any) {
                // @ts-expect-error TS(2304): Cannot find name 'emit'.
                emit(JSON.stringify([v, w]), 1);
            });
        });
};

// @ts-expect-error TS(6133): 'key' is declared but its value is never read.
const reduce = function (key: any, values: any) {
    // @ts-expect-error TS(2339): Property 'sum' does not exist on type 'ArrayConstr... Remove this comment to see the full error message
    return Array.sum(values);
};


const finalize = function finalize(key: any, value: any) {
    var vector = JSON.parse(key);
    var sourceKey = Object.keys(vector[0])[0];
    var targetKey = Object.keys(vector[1])[0];
    var obj = {
        source: vector[0][sourceKey],
        target: vector[1][targetKey],
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
