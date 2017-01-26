export default column => doc =>
new Promise((resolve, reject) => {
    try {
        resolve({
            [column]: doc[column].toUpperCase(),
        });
    } catch (error) {
        reject(error);
    }
});
