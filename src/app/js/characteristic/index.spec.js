import expect from 'expect';

import TITLE_SCHEME from '../../../common/titleScheme';

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
            newCharacteristics: ['foo'],
        });
    });

    describe('getUpdateCharacteristicsRequest', () => {
        it('should return the correct request', () => {
            const request = getUpdateCharacteristicsRequest({
                user: { token: 'test' },
                characteristic: {
                    newCharacteristics: [{
                        _id: 'foo',
                        value: 'foo1',
                        foo: true,
                    }, {
                        _id: 'bar',
                        value: 'bar1',
                        bar: true,
                    }],
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
                body: JSON.stringify([{
                    _id: 'foo',
                    value: 'foo1',
                }, {
                    _id: 'bar',
                    value: 'bar1',
                }]),
            });
        });
    });

    describe('getDatasetTitle', () => {
        it('should return characteristic name of characteristic with titleScheme', () => {
            const state = {
                characteristic: {
                    characteristics: [
                        { value: 'title', scheme: TITLE_SCHEME },
                        { value: 'other', scheme: 'other' },
                    ],
                },
            };
            expect(getDatasetTitle(state)).toBe('title');
        });
        it('should return null if no matching characteristics found', () => {
            const state = {
                characteristic: {
                    characteristics: [
                        { value: 'other', scheme: 'other' },
                        { value: 'another', scheme: 'another' },
                    ],
                },
            };
            expect(getDatasetTitle(state)).toBe(null);
        });
    });
});
