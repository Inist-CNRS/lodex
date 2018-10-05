/* eslint import/prefer-default-export: off */
import PropTypes from 'prop-types';

import { PROPOSED, VALIDATED, REJECTED } from '../../common/propositionStatus';

export const polyglot = PropTypes.shape({
    t: PropTypes.func.isRequired,
});

export const field = PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    scheme: PropTypes.string,
});

export const facet = PropTypes.shape({
    field,
    value: PropTypes.string.isRequired,
});

export const facetValue = PropTypes.shape({
    value: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
});

export const resource = PropTypes.shape({
    uri: PropTypes.string,
});

export const contributor = PropTypes.object;

export const property = PropTypes.shape({
    name: PropTypes.string.isRequired,
    scheme: PropTypes.string,
    status: PropTypes.oneOf([PROPOSED, VALIDATED, REJECTED]),
    validatedFields: PropTypes.arrayOf(PropTypes.string),
});

export const validationFieldProperty = PropTypes.shape({
    error: PropTypes.string,
    isValid: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
});

export const validationField = PropTypes.shape({
    isValid: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    properties: PropTypes.arrayOf(validationFieldProperty).isRequired,
});

export const formField = {
    input: PropTypes.shape({}).isRequired,
    label: PropTypes.string.isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool.isRequired,
        error: PropTypes.string,
    }).isRequired,
};
