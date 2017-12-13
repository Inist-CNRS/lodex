// take a function and apply it to the value or if value is an array to every item in the array.
export default fn => value => {
    if (Array.isArray(value)) {
        return value.map(fn);
    }

    return fn(value);
};
