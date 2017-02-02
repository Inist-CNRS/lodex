export const upperCase = (value) => {
    if (Array.isArray(value)) {
        return value.map(upperCase);
    }

    if (typeof value === 'object') {
        return Object.keys(value).reduce((result, key) => ({
            ...result,
            [key]: upperCase(value[key]),
        }), {});
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
    args: [],
});

export default transformation;
