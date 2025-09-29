import merge from 'lodash/merge';

// @ts-expect-error TS7006
export default (defaultValue, value) => {
    return merge(merge({}, defaultValue), value);
};
