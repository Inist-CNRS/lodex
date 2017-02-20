import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { fromFields } from '../../selectors';

export const SET_VALIDATION = 'SET_VALIDATION';

export const setValidation = createAction(SET_VALIDATION);

export const defaultState = {
    isValid: true,
};

export default handleActions({
    SET_VALIDATION: (state, { payload }) => payload,
}, defaultState);

const getValidationFields = state => state.admin.validation.fields;

export const getInvalidFields = createSelector(
    fromFields.getFields,
    getValidationFields,
    (fields = [], validationFields = []) => validationFields
        .filter(({ isValid }) => !isValid)
        .map(field => ({
            ...field,
            index: fields.findIndex(f => f.name === field.name),
        })),
);

export const getIsValid = state => state.admin.validation.isValid;
