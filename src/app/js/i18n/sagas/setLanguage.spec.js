import { call, put } from 'redux-saga/effects';

import { setLanguageSuccess, setLanguageError } from '../';

import { loadPhrases, handleSetLanguage } from './setLanguage';

describe('i18n saga', () => {
    describe('handleSetLanguage', () => {
        it('should put setLanguage action with language and phrases', () => {
            const saga = handleSetLanguage({ payload: 'fr' });
            expect(saga.next({ key: 'value' }).value).toEqual(
                call(loadPhrases, 'fr'),
            );
            expect(saga.next(['phrases']).value).toEqual(
                put(
                    setLanguageSuccess(
                        { phrases: ['phrases'], language: 'fr' },
                        { key: 'value' },
                    ),
                ),
            );
        });

        it('should put setLanguageError action with error if any', () => {
            const failedSaga = handleSetLanguage({ payload: 'fr' });
            const error = new Error('foo');
            failedSaga.next();
            expect(failedSaga.throw(error).value).toEqual(
                put(setLanguageError(error)),
            );
        });
    });
});
