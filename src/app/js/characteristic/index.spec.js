import expect from 'expect';

import TITLE_SCHEME from '../../../common/titleScheme';
import { COVER_COLLECTION, COVER_DATASET } from '../../../common/cover';

import reducer, {
    defaultState,
    getUpdateCharacteristicsRequest,
    getDatasetTitle,
} from './';

import {
    loadPublicationSuccess,
} from '../publication';

describe('characteristic reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the LOAD_PUBLICATION_SUCCESS action', () => {
        const action = loadPublicationSuccess({
            characteristics: ['foo'],
            fields: ['bar'],
            published: true,
        });
        const state = reducer(defaultState, action);

        expect(state).toEqual({
            ...defaultState,
            characteristics: ['foo'],
            newCharacteristics: 'foo',
        });
    });

    describe('getUpdateCharacteristicsRequest', () => {
        it('should return the correct request', () => {
            const request = getUpdateCharacteristicsRequest({
                user: { token: 'test' },
                characteristic: {
                    newCharacteristics: 'foo',
                },
            });
            expect(request).toEqual({
                url: '/api/characteristic',
                method: 'PUT',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer test',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify('foo'),
            });
        });
    });

    describe('getDatasetTitle', () => {
        it('should return characteristic name of characteristic with titleScheme', () => {
            const state = {
                publication: {
                    fields: [
                        { name: 'title', scheme: TITLE_SCHEME, cover: COVER_DATASET },
                        { name: 'title_resource', scheme: TITLE_SCHEME, cover: COVER_COLLECTION },
                        { name: 'other', scheme: 'other' },
                    ],
                },
                characteristic: {
                    characteristics: {
                        title: 'foo',
                    },
                },
            };
            expect(getDatasetTitle(state)).toBe('foo');
        });
        it('should return null if no matching characteristics found', () => {
            const state = {
                publication: {
                    fields: [
                        { name: 'title_resource', scheme: TITLE_SCHEME, cover: COVER_COLLECTION },
                        { name: 'other', scheme: 'other' },
                    ],
                },
                characteristic: {
                    characteristics: {
                        foo: 'bar',
                    },
                },
            };
            expect(getDatasetTitle(state)).toBe(null);
        });
    });
});
