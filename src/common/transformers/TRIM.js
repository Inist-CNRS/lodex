export const trimString = value => {
    if (!value) {
        return null;
    }

    if (Array.isArray(value)) {
        return value.map(trimString);
    }

    if (typeof value === 'object') {
        return null;
    }

    return value.trim();
};

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(trimString(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'TRIM',
    type: 'transform',
    args: [],
});

export default transformation;
