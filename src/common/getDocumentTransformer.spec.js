import expect from 'expect';

import getDocumentTransformer, { getFieldTransformation, applyTransformation } from './getDocumentTransformer';

describe('getDocumentTransformer', () => {
    it('should create a new document based on columns and doc', async () => {
        const columns = [
            {
                name: 'newA',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                    { operation: 'UPPERCASE', args: [] },
                ],
            },
            {
                name: 'newB',
                transformers: [
                    { operation: 'COLUMN', args: ['b'] },
                ],
            },
        ];

        const doc = {
            a: 'hello',
            b: 'world',
            c: 'or not',
        };

        const newDoc = await getDocumentTransformer({})(columns)('pre')(doc);

        expect(newDoc).toEqual({
            newA: 'HELLO',
            newB: 'world',
        });
    });

    it('should return empty document if no columns', async () => {
        const doc = {
            a: 'hello',
            b: 'world',
            c: 'or not',
        };

        const newDoc = await getDocumentTransformer({})([])('pre')(doc);

        expect(newDoc).toEqual({});
    });

    describe('getFieldTransformation', () => {
        it('should create a function returnning new document with only transformed column name', async () => {
            const column = {
                name: 'A',
                transformers: [
                    { operation: 'COLUMN', args: ['a'] },
                    { operation: 'UPPERCASE', args: [] },
                ],
            };

            const transform = getFieldTransformation('pre', {})(column);

            expect(await transform({ a: 'hello' })).toEqual({
                A: 'HELLO',
            });
        });
    });

    describe('applyTransformation', () => {
        it('should apply allDocumentTransformers to document and combine their results', async () => {
            const documentTransformers = [
                doc => Promise.resolve({ a: doc.A }),
                doc => Promise.resolve({ original: doc }),
            ];
            const doc = {
                A: 1,
                B: 2,
            };
            const newDoc = await applyTransformation(documentTransformers)(doc);
            expect(newDoc).toEqual({
                a: 1,
                original: doc,
            });
        });
    });
});
