import expect, { createSpy } from 'expect';
import initializeFields from './initializeFields';
import { URI_FIELD_NAME } from '../../common/uris';
import { COVER_COLLECTION } from '../../common/cover';

describe('initializeFields', () => {
    it('should try to find an existing uri field', async () => {
        const ctx = {
            field: {
                findOne: createSpy().andReturn(Promise.resolve(null)),
                insertOne: createSpy().andReturn(Promise.resolve(null)),
            },
        };

        await initializeFields(ctx, () => Promise.resolve());

        expect(ctx.field.findOne).toHaveBeenCalledWith({ name: URI_FIELD_NAME });
    });

    it('should create a new uri field if not present', async () => {
        const ctx = {
            field: {
                findOne: createSpy().andReturn(null),
                insertOne: createSpy().andReturn(null),
            },
        };

        await initializeFields(ctx, () => {});

        expect(ctx.field.insertOne).toHaveBeenCalledWith({
            cover: COVER_COLLECTION,
            label: URI_FIELD_NAME,
            name: URI_FIELD_NAME,
            cover: 'collection',
            transformers: [],
        });
    });

    it('should not create a new uri field if present', async () => {
        const ctx = {
            field: {
                findOne: createSpy().andReturn({}),
                insertOne: createSpy().andReturn(null),
            },
        };

        await initializeFields(ctx, () => {});

        expect(ctx.field.insertOne).toNotHaveBeenCalled();
    });
});
