import prefixes from '../../../common/prefixes';

// @ts-expect-error TS7006
export default (input) => {
    if (!input) {
        return input;
    }
    let output = input;
    Object.keys(prefixes)
        // @ts-expect-error TS(7053): Element implicitly has an any type because expression of type string can't be used to index type
        .filter((prefix) => input.indexOf(prefixes[prefix]) >= 0)
        .forEach((prefix) => {
            // @ts-expect-error TS(7053): Element implicitly has an any type because expression of type string can't be used to index type
            output = input.replace(prefixes[prefix], prefix.concat(':'));
        });
    return output;
};
