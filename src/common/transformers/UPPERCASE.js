const transformation = () => field => doc =>
new Promise((resolve, reject) => {
    try {
        resolve({
            [field]: doc[field].toUpperCase(),
        });
    } catch (error) {
        reject(error);
    }
});

transformation.getMetas = () => ({
    name: 'UPPERCASE',
    args: [],
});

export default transformation;
