import expect, { createSpy } from 'expect';
import fetchLineBy from './fetchLineBy';

describe('fetchLineBy', () => {
    it('calls ctx.dataset.findBy', () => {
        const line = { data: 'the line' };
        const field = 'the field';
        const value = 'the value';

        const ctx = {
            dataset: {
                findBy: createSpy().andReturn(Promise.resolve(line)),
            },
        };

        fetchLineBy(ctx)(field, value);
        expect(ctx.dataset.findBy).toHaveBeenCalledWith(field, value);
    });

    it('returns the line with a computed uri when ctx.dataset.findBy succeeds', async () => {
        const line = { data: 'the line' };
        const field = 'the field';
        const value = 'the value';

        const ctx = {
            dataset: {
                findBy: createSpy().andReturn(Promise.resolve(line)),
            },
        };

        const result = await fetchLineBy(ctx)(field, value);
        expect(result).toEqual({
            ...line,
            uri: `uri to ${field}: ${value}`,
        });
    });

    it('returns null when specified value is null', async () => {
        const field = 'the field';
        const value = null;

        const ctx = {
            dataset: {
                findBy: createSpy().andReturn(Promise.resolve()),
            },
        };

        const result = await fetchLineBy(ctx)(field, value);
        expect(result).toEqual(null);
    });

    it('returns null when referenced line is not found', async () => {
        const field = 'the field';
        const value = 'the value';

        const ctx = {
            dataset: {
                findBy: createSpy().andReturn(Promise.resolve()),
            },
        };

        const result = await fetchLineBy(ctx)(field, value);
        expect(result).toEqual(null);
    });
});
