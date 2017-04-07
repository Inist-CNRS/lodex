import React, { PropTypes } from 'react';
import memoize from 'lodash.memoize';

import { field as fieldPropTypes } from '../../propTypes';
import { isLongText, getShortText } from '../../lib/longTexts';
import { REJECTED } from '../../../../common/propositionStatus';

const styles = {
    text: memoize(status => Object.assign({
        fontSize: '1.5rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    })),
};

const IstexView = ({ className, resource, field, fieldStatus, shrink }) => (
    <span style={styles.text(fieldStatus)}>
        {
            shrink && isLongText(resource[field.name])
            ? <span className={className}>{getShortText(resource[field.name])}</span>
            : <span className={className}>{resource[field.name]}</span>
        }
    </span>
);

IstexView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    shrink: PropTypes.bool,
};

IstexView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
};

export default IstexView;
