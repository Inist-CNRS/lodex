import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { getFields } from '../fields';

export const SET_VALIDATION = 'SET_VALIDATION';

export const setValidation = createAction(SET_VALIDATION);

export const defaultState = {
    isValid: true,
};

export default handleActions({
    SET_VALIDATION: (state, { payload }) => payload,
}, defaultState);

const getValidationFields = state => state.validation.fields;

export const getInvalidFields = createSelector(
    getFields,
    getValidationFields,
    (fields = [], validationFields = []) => validationFields
        .filter(({ isValid }) => !isValid)
        .map(field => ({
            ...field,
            index: fields.findIndex(f => f.name === field.name),
        })),
);
