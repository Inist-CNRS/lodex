export const capitalizeString = value => {
    if (!value) {
        return null;
    }

    if (Array.isArray(value)) {
        return value.map(capitalizeString);
    }

    if (typeof value === 'object') {
        return null;
    }
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const transformation = () => value =>
    new Promise((resolve, reject) => {
        try {
            resolve(capitalizeString(value));
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'CAPITALIZE',
    type: 'transform',
    args: [],
});

export default transformation;
