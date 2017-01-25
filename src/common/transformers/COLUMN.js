import jbj from 'jbj';

export default (destinationColumn, sourceColumn) => doc =>
new Promise((resolve, reject) => {
    return jbj.render({
        [`$${destinationColumn}`]: {
            get: sourceColumn
        },
        mask: destinationColumn
    }, doc, (error, result) => {
        if (error) {
            reject(error);
            return;
        }
        resolve(result)
    });

});
