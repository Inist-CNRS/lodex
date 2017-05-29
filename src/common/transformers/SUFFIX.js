export const suffix = (value, str) => {
    if (!value) {
        return str;
    }

    if (typeof value === 'string') {
        return value.concat(str);
    }

    if (Array.isArray(value)) {
        return [...value, str];
    }

    return String(value).concat(value);
};

const transformation = (_, args) => (value) => {
    const arg = args.find(a => a.name === 'with');

    if (!arg) {
        throw new Error('Invalid Argument for SUFFIX transformation');
    }

    return new Promise((resolve, reject) => {
        try {
            resolve(suffix(value, arg.value));
        } catch (error) {
            reject(error);
        }
    });
};

transformation.getMetas = () => ({
    name: 'SUFFIX',
    type: 'transform',
    args: [
        { name: 'with', type: 'string' },
    ],
});

export default transformation;
