/* eslint import/prefer-default-export: off */
import { PropTypes } from 'react';

export const polyglot = PropTypes.shape({
    t: PropTypes.func.isRequired,
    tc: PropTypes.func.isRequired,
    tu: PropTypes.func.isRequired,
    tm: PropTypes.func.isRequired,
});

export const property = PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
});
