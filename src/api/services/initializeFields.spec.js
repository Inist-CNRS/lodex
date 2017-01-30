import expect, { createSpy } from 'expect';
import initializeFields from './initializeFields';
import { URI_FIELD_NAME } from '../../common/uris';

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
            name: URI_FIELD_NAME,
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
