import prefixes from '../../../common/prefixes';

export default input => {
    if (!input) {
        return input;
    }
    let output = input;
    Object.keys(prefixes)
        .filter(prefix => input.indexOf(prefixes[prefix]) >= 0)
        .forEach(prefix => {
            output = input.replace(prefixes[prefix], prefix.concat(':'));
        });
    return output;
};
