// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { translate } from '../../i18n/I18NContext';

export const FieldInputComponent = ({
    // @ts-expect-error TS7031
    id,
    // @ts-expect-error TS7031
    component,
    // @ts-expect-error TS7031
    labelKey,
    // @ts-expect-error TS7031
    name,
    // @ts-expect-error TS7031
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
