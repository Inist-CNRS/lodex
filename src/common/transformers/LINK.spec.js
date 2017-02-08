import expect, { createSpy } from 'expect';

import getDocumentTransformer from '../getDocumentTransformer';

describe('LINK', () => {
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

    const db = {
        dataset: {
            findBy: createSpy().andReturn(linkedDoc),
        },
    };

    it('should link ref column to id column returning uri toward referenced document', async () => {
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

        const newDoc = await getDocumentTransformer({ env: 'node', dataset: db.dataset }, fields)(doc);
        expect(db.dataset.findBy).toHaveBeenCalledWith('id', 'id2');
        expect(newDoc).toEqual({
            link: 'uri2',
        });
    });
});
