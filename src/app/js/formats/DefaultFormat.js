import React, { PropTypes } from 'react';
import memoize from 'lodash.memoize';

import { field as fieldPropTypes } from '../propTypes';
import FormTextField from '../lib/FormTextField';
import { isLongText, getShortText } from '../lib/longTexts';
import { REJECTED } from '../../../common/propositionStatus';

const styles = {
    text: memoize(status => Object.assign({
        fontSize: '1.5rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    })),
};

const DefaultView = ({ className, resource, field, fieldStatus, shrink }) => (
    <span style={styles.text(fieldStatus)}>
        {
            shrink && isLongText(resource[field.name])
            ? <span className={className}>{getShortText(resource[field.name])}</span>
            : <span className={className}>{resource[field.name]}</span>
        }
    </span>
);

DefaultView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    shrink: PropTypes.bool,
};

DefaultView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
};

const Empty = () => <span />;

export default {
    Component: DefaultView,
    ListComponent: DefaultView,
    AdminComponent: Empty,
    EditionComponent: FormTextField,
};
