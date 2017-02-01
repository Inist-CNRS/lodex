export default ({ getDocumentByField }) =>
    (destinationField, refColumnName, idColumnName) => doc =>
        getDocumentByField(idColumnName, doc[refColumnName]).then(uri => ({
            [destinationField]: uri,
        }));
