import expect from 'expect';

import { fromRouter } from './selectors';

describe('selectors.fromRouter.getResourceUri', () => {
    it('should get uid uri', () => {
        expect(
            fromRouter.getResourceUri({
                router: {
                    location: {
                        pathname: '/uid:/785123',
                    },
                },
            }),
        ).toBe('uid:/785123');
    });

    it('should get ark uri', () => {
        expect(
            fromRouter.getResourceUri({
                router: {
                    location: {
                        pathname: '/ark:/123/785123',
                    },
                },
            }),
        ).toBe('ark:/123/785123');
    });

    it('should get resource?uri', () => {
        expect(
            fromRouter.getResourceUri({
                router: {
                    location: {
                        pathname: '/resource',
                        search: '?uri=456',
                    },
                },
            }),
        ).toBe('456');
    });
});
