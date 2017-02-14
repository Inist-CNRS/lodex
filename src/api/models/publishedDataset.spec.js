import expect, { createSpy } from 'expect';

import publishedDataset from './publishedDataset';

describe('publishedDataset', () => {
    describe('addVersion', () => {
        const collection = {
            update: createSpy(),
        };
        const db = {
            collection: () => collection,
        };
        const publishedDatasetCollection = publishedDataset(db);

        it('should call update', async () => {
            const date = new Date();
            await publishedDatasetCollection.addVersion({
                uri: 'uri',
            }, {
                new: 'version',
                uri: 'uri',
            }, date);
            expect(collection.update).toHaveBeenCalledWith(
                { uri: 'uri' },
                {
                    $push: {
                        versions: {
                            new: 'version',
                            publicationDate: date,
                        },
                    },
                },
            );
        });
    });

    describe('addFieldToResource', () => {
        const previousResource = {
            uri: 'uri',
            versions: [{
                field: 'value',
            }],
        };
        const collection = {
            findOne: createSpy().andReturn(previousResource),
            update: createSpy(),
        };
        const db = {
            collection: () => collection,
        };
        const publishedDatasetCollection = publishedDataset(db);

        it('should call addFieldToResource with uri', async () => {
            const contributor = {
                name: 'peregrin took',
                mail: 'peregrin.took@shire.net',
            };

            const field = {
                name: 'newField',
                value: 'newValue',
            };
            const date = new Date();
            await publishedDatasetCollection.addFieldToResource('uri', contributor, field, 'isLoggedIn', date);

            expect(collection.findOne).toHaveBeenCalledWith({ uri: 'uri' });
            expect(collection.update).toHaveBeenCalledWith(
                { uri: 'uri' },
                {
                    $addToSet: {
                        contributions: {
                            fieldName: field.name,
                            contributor,
                            accepted: 'isLoggedIn',
                        },
                    },
                    $push: {
                        versions: {
                            field: 'value',
                            newField: 'newValue',
                            publicationDate: date,
                        },
                    },
                },
            );
        });
    });
});
