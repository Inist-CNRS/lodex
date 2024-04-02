const parseValue = (value) => {
    if (typeof value === 'object') {
        return value;
    }
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
};

export default parseValue;
