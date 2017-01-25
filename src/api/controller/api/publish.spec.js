/* eslint max-len: off */
import expect, { createSpy } from 'expect';
import publish from './publish';

describe('publish', () => {
    const dataset = [{ foo: 'foo1', bar: 'bar1' }, { foo: 'foo2', bar: 'bar2' }];
    const toArray = createSpy().andReturn(dataset);
    const limit = createSpy().andReturn({ toArray });
    const skip = createSpy().andReturn({ limit });
    const ctx = {
        dataset: {
            count: createSpy().andReturn(Promise.resolve(201)),
            find: createSpy().andReturn({ skip }),
        },
        publishedDataset: {
            insertMany: createSpy(),
        },
        publishedModel: {
            insertMany: createSpy(),
        },
        redirect: createSpy(),
    };

    it('should get the total number of items in the original dataset', async () => {
        await publish(ctx);
        expect(ctx.dataset.count).toHaveBeenCalledWith({});
    });

    it('should load items from the original dataset and insert them in the publishedDataset by page of 100', async () => {
        await publish(ctx);
        expect(ctx.dataset.find).toHaveBeenCalledWith({});
        expect(skip).toHaveBeenCalledWith(0);
        expect(skip).toHaveBeenCalledWith(200); // Ensure we got to the third page
        expect(limit).toHaveBeenCalledWith(100);
        expect(toArray).toHaveBeenCalledWith();
        expect(ctx.publishedDataset.insertMany).toHaveBeenCalledWith(dataset);
    });

    it('should have insert the publishedModel', async () => {
        await publish(ctx);
        expect(ctx.publishedModel.insertMany).toHaveBeenCalledWith([
            { key: 'foo', label: 'Foo' },
            { key: 'bar', label: 'Bar' },
        ]);
    });

    it('should redirect to the publication route', async () => {
        await publish(ctx);
        expect(ctx.redirect).toHaveBeenCalledWith('/api/publication');
    });
});
