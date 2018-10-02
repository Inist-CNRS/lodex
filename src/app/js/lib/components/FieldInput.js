import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../../propTypes';

export const FieldInputComponent = ({
    id,
    component,
    labelKey,
    name,
    p: polyglot,
    ...props
}) => (
    <Field
        id={id}
        name={name}
        component={component}
        label={polyglot.t(labelKey)}
        {...props}
    />
);

FieldInputComponent.propTypes = {
    id: PropTypes.string,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
        .isRequired,
    labelKey: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

FieldInputComponent.defaultProps = {
    id: null,
};

export default translate(FieldInputComponent);
