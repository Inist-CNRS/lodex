import React, { PropTypes } from 'react';
import { field as fieldPropTypes } from '../propTypes';
import FormTextField from '../lib/FormTextField';
import { isLongText, getShortText } from '../lib/longTexts';

const DefaultView = ({ className, resource, field, shrink }) => (
    shrink && isLongText(resource[field.name])
    ? <span className={className}>{getShortText(resource[field.name])}</span>
    : <span className={className}>{resource[field.name]}</span>
);

DefaultView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    shrink: PropTypes.bool,
};

DefaultView.defaultProps = {
    className: null,
    shrink: false,
};

const Empty = () => <span />;

export default {
    Component: DefaultView,
    AdminComponent: Empty,
    EditionComponent: FormTextField,
};
