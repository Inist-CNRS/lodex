import { getResourceUri, moveUriToFirstPosition } from './uris';

describe('uris', () => {
    describe('getResourceUri', () => {
        it('should return /<uri> if uri start with uid:/', () => {
            expect(getResourceUri({ uri: 'uid:/my_uri' })).toBe('/uid:/my_uri');
        });

        it('should return /<uri> if uri start with ark:/', () => {
            expect(getResourceUri({ uri: 'ark:/my_uri' })).toBe('/ark:/my_uri');
        });

        it('should return /resource?uri=encoded<uri> if uri start with http://', () => {
            expect(getResourceUri({ uri: 'http://my_uri' })).toBe(
                '/resource?uri=http%3A%2F%2Fmy_uri',
            );
        });

        it('should return /uid:/encoded<uri> otherwise', () => {
            expect(getResourceUri({ uri: 'my uri' })).toBe('/uid:/my%20uri');
        });
    });
    describe('moveUriToFirstPosition', () => {
        it('should move uri to first position', () => {
            expect(
                moveUriToFirstPosition([
                    { a: 'a', b: 'b', uri: 'uri1' },
                    { a: 'a', b: 'b', uri: 'uri2' },
                    { a: 'a', b: 'b', uri: 'uri3' },
                ]),
            ).toEqual([
                { uri: 'uri1', a: 'a', b: 'b' },
                { uri: 'uri2', a: 'a', b: 'b' },
                { uri: 'uri3', a: 'a', b: 'b' },
            ]);
        });
    });
});
