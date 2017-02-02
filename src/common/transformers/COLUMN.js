const transformation = (_, args) => doc =>
    new Promise((resolve, reject) => {
        try {
            if (!doc) {
                resolve(null);
                return;
            }
            const sourceField = args.find(a => a.name === 'column');
            resolve(doc[sourceField.value]);
        } catch (error) {
            reject(error);
        }
    });

transformation.getMetas = () => ({
    name: 'COLUMN',
    args: [{
        name: 'column',
        type: 'column',
    }],
});

export default transformation;
