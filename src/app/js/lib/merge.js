import merge from 'lodash.merge';

export default (defaultValue, value) => {
    return merge(merge({}, defaultValue), value);
};
