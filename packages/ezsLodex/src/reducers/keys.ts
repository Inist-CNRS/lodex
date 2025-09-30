/* eslint-disable */
//
// MongoDB JS functions
//

const map = function(this: any) {
    var doc = this;
    var dta = doc.versions[doc.versions.length - 1];
    dta.uri = doc.uri;
    Object.keys(dta).forEach(function (key) {
      // @ts-expect-error TS(2304): Cannot find name 'emit'.
      emit(key, 1);
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
