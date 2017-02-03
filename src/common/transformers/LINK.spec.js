import expect from 'expect';

import getDocumentTransformer from '../getDocumentTransformer';
import * as fixtures from '../tests/fixtures';

describe('LINK', () => {
    describe('functional', () => {
        beforeEach(async () => {
            await fixtures.clear();
        });

        it('should link ref column to id column returning uri toward referenced document', async () => {
            const db = await fixtures.connect();
            const doc = {
                uri: 'uri1',
                id: 'id1',
                ref: 'id2',
                data: 'some data',
            };
            const linkedDoc = {
                uri: 'uri2',
                id: 'id2',
                ref: 'uri3',
                data: 'some other data',
            };
            db.dataset.insertMany([doc, linkedDoc]);
            const fields = [
                {
                    name: 'link',
                    transformers: [
                        {
                            operation: 'LINK',
                            args: [
                                { name: 'referenceColumn', value: 'ref' },
                                { name: 'identifierColumn', value: 'id' },
                            ],
                        },
                    ],
                },
            ];

            const newDoc = await getDocumentTransformer({ env: 'node', db }, fields)(doc);

            expect(newDoc).toEqual({
                link: 'uri2',
            });
        });
    });
});
