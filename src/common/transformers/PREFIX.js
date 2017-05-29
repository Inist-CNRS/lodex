export const prefix = (value, str) => {
    if (!value) {
        return str;
    }

    if (typeof value === 'string') {
        return str.concat(value);
    }

    if (Array.isArray(value)) {
        return [str, ...value];
    }

    return str.concat(String(value));
};

const transformation = (_, args) => (value) => {
    const arg = args.find(a => a.name === 'with');

    if (!arg) {
        throw new Error('Invalid Argument for PREFIX transformation');
    }

    return new Promise((resolve, reject) => {
        try {
            resolve(prefix(value, arg.value));
        } catch (error) {
            reject(error);
        }
    });
};

transformation.getMetas = () => ({
    name: 'PREFIX',
    type: 'transform',
    args: [
        { name: 'with', type: 'string' },
    ],
});

export default transformation;
