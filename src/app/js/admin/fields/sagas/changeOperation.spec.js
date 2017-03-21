import expect from 'expect';
import { put, select } from 'redux-saga/effects';
import { change } from 'redux-form';

import { fromFields } from '../../selectors';

import { handleChangeOperation } from './changeOperation';

describe('fields saga', () => {
    describe('changeOperation', () => {
        const saga = handleChangeOperation({ payload: { operation: 'operation', fieldName: 'fieldName' } });

        it('should select fromFields.getTransformerArgs', () => {
            expect(saga.next().value).toEqual(select(fromFields.getTransformerArgs, 'operation'));
        });

        it('should put redux-form change', () => {
            expect(saga.next('transformer args').value)
                .toEqual(put(change('field', 'fieldName.args', 'transformer args')));
        });
    });
});
