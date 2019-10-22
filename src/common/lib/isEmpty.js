export default value =>
    value === null ||
    typeof value === 'undefined' ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);
