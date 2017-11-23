import { race, call, take, put, select } from 'redux-saga/effects';
import expect from 'expect';
import { replace } from 'react-router-redux';

import fetchSaga from './fetchSaga';
import fetch from '../fetch';
import { logout } from '../../user';
import { getCurrentLocation } from '../../sharedSelectors';

describe('sagas fetch', () => {
    let iterator;
    const request = { url: 'bibcnrs.fr', config: 'data' };
    beforeEach(() => {
        iterator = fetchSaga(request, 'STOP');
    });

    it('should race call(fetch) with take(STOP)', () => {
        const next = iterator.next();
        expect(next.value).toEqual(
            race({
                fetchResult: call(fetch, request, 'json'),
                cancel: take(['STOP']),
            }),
        );
    });

    it('should return cancel result if it is present', () => {
        iterator.next();
        const next = iterator.next({
            cancel: 'cancel',
            fetchResult: 'fetchResult',
        });

        expect(next.value).toEqual({ cancel: 'cancel' });
        expect(next.done).toBe(true);
    });

    it('should select currentLocation, redirect to login put logout and return if 401', () => {
        iterator.next();
        let next = iterator.next({ fetchResult: { error: { code: 401 } } });
        expect(next.value).toEqual(select(getCurrentLocation));

        next = iterator.next({
            locationBeforeTransitions: { pathname: 'currentLocation.pathname' },
        });

        expect(next.value).toEqual(
            put(
                replace({
                    pathname: '/login',
                    state: { nextPathname: 'currentLocation.pathname' },
                }),
            ),
        );
        next = iterator.next();
        expect(next.value).toEqual(put(logout()));
        next = iterator.next();
        expect(next.done).toBe(true);
    });

    it('should return fetchResult if no cancel', () => {
        iterator.next();
        const next = iterator.next({ fetchResult: 'fetchResult' });

        expect(next.value).toBe('fetchResult');
        expect(next.done).toBe(true);
    });
});
