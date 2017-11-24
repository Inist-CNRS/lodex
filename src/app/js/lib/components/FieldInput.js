import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../../propTypes';

export const FieldInputComponent = ({
    component,
    labelKey,
    name,
    p: polyglot,
    ...props
}) => (
    <Field
        name={name}
        component={component}
        label={polyglot.t(labelKey)}
        {...props}
    />
);

FieldInputComponent.propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
        .isRequired,
    labelKey: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldInputComponent);
