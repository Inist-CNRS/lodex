const parseValue = (value: any) => {
    if (typeof value === 'object') {
        return value;
    }
    try {
        return JSON.parse(value);
    } catch (_e) {
        return value;
    }
};

export default parseValue;
