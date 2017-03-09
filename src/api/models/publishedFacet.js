import chunk from 'lodash.chunk';

export default (db) => {
    const collection = db.collection('publishedFacet');

    collection.insertBatch = documents => chunk(documents, 100).map(data => collection.insertMany(data));

    collection.insertFacet = (field, values) =>
        collection.insertBatch(values.map(value => ({
            field,
            value,
        })));

    return collection;
};
