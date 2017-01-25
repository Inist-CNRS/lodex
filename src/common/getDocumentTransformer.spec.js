import expect from 'expect';

import { getDocumentTransformations, applyTransformation } from './getDocumentTransformer';

describe.only('getDocumentTransformer', () => {
    describe('getDocumentTransformations', () => {
        
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
