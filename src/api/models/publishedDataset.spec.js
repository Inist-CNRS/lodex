import expect, { createSpy } from 'expect';

import publishedDataset from './publishedDataset';
import { VALIDATED } from '../../common/propositionStatus';

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

        describe('isLoggedIn: true', () => {
            it('should call addFieldToResource with uri status validated and increment accepted count', async () => {
                const contributor = {
                    name: 'peregrin took',
                    mail: 'peregrin.took@shire.net',
                };

                const field = {
                    name: 'newField',
                    value: 'newValue',
                };
                const date = new Date();
                await publishedDatasetCollection.addFieldToResource('uri', contributor, field, true, date);

                expect(collection.findOne).toHaveBeenCalledWith({ uri: 'uri' });
                expect(collection.update).toHaveBeenCalledWith(
                    { uri: 'uri' },
                    {
                        $addToSet: {
                            contributions: {
                                fieldName: field.name,
                                contributor,
                                status: VALIDATED,
                            },
                        },
                        $inc: {
                            acceptedPropositionCount: 1,
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

        describe('isLoggedIn: false', () => {
            it('should call addFieldToResource with uri status proposed and increment proposedCount', async () => {
                const contributor = {
                    name: 'peregrin took',
                    mail: 'peregrin.took@shire.net',
                };

                const field = {
                    name: 'newField',
                    value: 'newValue',
                };
                const date = new Date();
                await publishedDatasetCollection.addFieldToResource('uri', contributor, field, false, date);

                expect(collection.findOne).toHaveBeenCalledWith({ uri: 'uri' });
                expect(collection.update).toHaveBeenCalledWith(
                    { uri: 'uri' },
                    {
                        $addToSet: {
                            contributions: {
                                fieldName: field.name,
                                contributor,
                                status: 'proposed',
                            },
                        },
                        $inc: {
                            proposedPropositionCount: 1,
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
});
