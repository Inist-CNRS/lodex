import expect, { createSpy } from 'expect';
import { mongoClientFactory } from './mongoClient';

describe('mongoClient middleware', () => {
    const db = {
        collection: () => ({ createIndex: () => {} }),
        close: createSpy(),
    };

    const next = () => Promise.resolve();

    const MongoClientImpl = {
        connect: createSpy().andReturn(db),
    };

    it('it should close mongo connection when keepDbOpened is falsy', async () => {
        await mongoClientFactory(MongoClientImpl)({}, next);
        expect(db.close).toHaveBeenCalled();
    });

    it('it should not close mongo connection when keepDbOpened is true', async () => {
        await mongoClientFactory(MongoClientImpl)({ keepDbOpened: true }, next);
        expect(db.close).toNotHaveBeenCalled();
    });

    afterEach(() => {
        db.close.reset();
    });
});
