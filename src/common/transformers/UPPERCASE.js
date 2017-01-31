export default () => field => doc =>
new Promise((resolve, reject) => {
    try {
        resolve({
            [field]: doc[field].toUpperCase(),
        });
    } catch (error) {
        reject(error);
    }
});
