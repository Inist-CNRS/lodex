import { call, select } from 'redux-saga/effects';

import { fromFields } from '../../sharedSelectors';
import updateReduxFormArray from '../../lib/sagas/updateReduxFormArray';
import { handleChangeOperation } from './changeOperation';

describe('fields saga', () => {
    describe('changeOperation', () => {
        const saga = handleChangeOperation({
            payload: { operation: 'operation', fieldName: 'fieldName' },
        });

        it('should select fromFields.getTransformerArgs', () => {
            expect(saga.next().value).toEqual(
                select(fromFields.getTransformerArgs, 'operation'),
            );
        });

        it('should put redux-form change', () => {
            expect(saga.next('transformer args').value).toEqual(
                call(
                    updateReduxFormArray,
                    'field',
                    'fieldName.args',
                    'transformer args',
                ),
            );
        });
    });
});
