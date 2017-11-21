import React from 'react';
import memoize from 'lodash.memoize';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '..//../propTypes';
import { isLongText, getShortText } from '../../lib/longTexts';
import { REJECTED } from '../../../../common/propositionStatus';

const styles = {
    text: memoize(status =>
        Object.assign({
            fontSize: '1.5rem',
            textDecoration: status === REJECTED ? 'line-through' : 'none',
        }),
    ),
};

const DefaultView = ({
    className,
    resource,
    field,
    fieldStatus,
    shrink,
    p: polyglot,
}) => {
    let value = resource[field.name];
    if (Array.isArray(value)) {
        return <p>{polyglot.t('bad_format', { label: field.label })}</p>;
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
    p: polyglotPropTypes.isRequired,
};

DefaultView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
};

export default translate(DefaultView);
