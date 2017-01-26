export default (destinationField, sourceField) => doc =>
new Promise((resolve, reject) => {
    try {
        resolve({
            [destinationField]: doc[sourceField],
        });
    } catch (error) {
        reject(error);
    }
});
