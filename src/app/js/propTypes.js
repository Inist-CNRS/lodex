/* eslint import/prefer-default-export: off */
import { PropTypes } from 'react';

export const polyglot = PropTypes.shape({
    t: PropTypes.func.isRequired,
    tc: PropTypes.func.isRequired,
    tu: PropTypes.func.isRequired,
    tm: PropTypes.func.isRequired,
});

export const field = PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    scheme: PropTypes.string,
});

export const resource = PropTypes.shape({
    uri: PropTypes.string.isRequired,
});

export const contributor = PropTypes.object;

export const property = PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    scheme: PropTypes.any.isRequired,
    accepted: PropTypes.bool,
    validatedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglot.isRequired,
});

export const validationFieldProperty = PropTypes.shape({
    error: PropTypes.string.isRequired,
    isValid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
});

export const validationField = PropTypes.shape({
    isValid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    properties: PropTypes.arrayOf(validationFieldProperty).isRequired,
});
