const transformation = (_, args) => doc =>
    new Promise((resolve, reject) => {
        try {
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
