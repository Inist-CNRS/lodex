import expect, { createSpy } from 'expect';

import LINK from './LINK';

describe('LINK', () => {
    it('should call ctx.getDocumentByField with the specified index', async () => {
        const getDocumentByField = createSpy().andReturn(Promise.resolve(''));

        await LINK({ getDocumentByField })('newA', 'column_ref', 'column_id')({ column_ref: 42 });
        expect(getDocumentByField).toHaveBeenCalledWith('column_id', 42);
    });

    it('should populate the document destination field with the URI from ctx.getDocumentByField', async () => {
        const getDocumentByField = createSpy().andReturn(Promise.resolve('uri_from_other_doc'));

        const doc = await LINK({ getDocumentByField })('newA', 'column_ref', 'column_id')({});
        expect(doc.newA).toEqual('uri_from_other_doc');
    });
});
