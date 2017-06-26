export const toString = (value) => {
    if (!value) {
        return '';
    }

    if (Array.isArray(value)) {
        return value.map(toString);
    }

    if (typeof value === 'string') {
        return value.trim();
    }

    if (typeof value === 'object') {
        return '';
    }

    return String(value).trim();
};

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(toString(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'UPPERCASE',
    type: 'transform',
    args: [],
});

export default transformation;
