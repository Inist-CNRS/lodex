import { call, put } from 'redux-saga/effects';
import { setLanguage } from 'redux-polyglot';

import { setLanguageSuccess, setLanguageError } from '../';

import { loadPhrases, handleSetLanguage } from './setLanguage';

describe('i18n saga', () => {
    describe('handleSetLanguage', () => {
        const saga = handleSetLanguage({ payload: 'fr' });

        it('should call loadPhrases with language from action', () => {
            expect(saga.next().value).toEqual(call(loadPhrases, 'fr'));
        });

        it('should put setLanguageSuccess action with the phrases from loadPhrases', () => {
            expect(saga.next({ key: 'value' }).value).toEqual(
                put(setLanguageSuccess('fr')),
            );
        });

        it('should put setLanguage action with language and phrases', () => {
            expect(saga.next({ key: 'value' }).value).toEqual(
                put(setLanguage('fr', { key: 'value' })),
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
