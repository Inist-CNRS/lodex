import React from 'react';
import memoize from 'lodash.memoize';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../propTypes';
import FormTextField from '../lib/components/FormTextField';
import { isLongText, getShortText } from '../lib/longTexts';
import { REJECTED } from '../../../common/propositionStatus';

const styles = {
    text: memoize(status =>
        Object.assign({
            fontSize: '1.5rem',
            textDecoration: status === REJECTED ? 'line-through' : 'none',
        }),
    ),
};

const DefaultView = ({ className, resource, field, fieldStatus, shrink }) => {
    let value = resource[field.name];

    if (Array.isArray(value)) {
        value = value.join(', ');
    }

    return (
        <span style={styles.text(fieldStatus)}>
            {shrink && isLongText(value) ? (
                <span className={className}>{getShortText(value)}</span>
            ) : (
                <span className={className}>{value}</span>
            )}
        </span>
    );
};

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
