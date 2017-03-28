export const upperCase = (value) => {
    if (!value) {
        return null;
    }

    if (Array.isArray(value)) {
        return value.map(upperCase);
    }

    if (typeof value === 'object') {
        return null;
    }

    return value.toUpperCase();
};

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(upperCase(value));
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
