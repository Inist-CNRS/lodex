import expect, { createSpy } from 'expect';
import { isSchemeValidFactory } from './isSchemeValid';

describe('scheme service', () => {
    describe('isSchemeValid', () => {
        it('should request the lov API for specified scheme', async () => {
            const fetchImp = createSpy().andReturn(Promise.resolve({}));

            await isSchemeValidFactory(fetchImp)('foo');

            expect(fetchImp).toHaveBeenCalledWith(
                'http://lov.okfn.org/dataset/lov/api/v2/vocabulary/info?vocab=foo',
            );
        });

        it('should return false if the lov return a 404', async () => {
            const fetchImp = createSpy().andReturn(Promise.resolve({ status: 404 }));

            const isValid = await isSchemeValidFactory(fetchImp)('foo');

            expect(isValid).toEqual(false);
        });

        it('should return true if the lov return a 200', async () => {
            const fetchImp = createSpy().andReturn(Promise.resolve({ status: 200 }));

            const isValid = await isSchemeValidFactory(fetchImp)('foo');

            expect(isValid).toEqual(true);
        });
    });
});
