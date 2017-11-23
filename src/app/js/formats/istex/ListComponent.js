import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash.memoize';

import { REJECTED } from '../../../../common/propositionStatus';
import { field as fieldPropTypes } from '../../propTypes';

const istexApiUrl = process.env.ISTEX_API_URL;

const styles = {
    text: memoize(status =>
        Object.assign({
            fontSize: '1.5rem',
            textDecoration: status === REJECTED ? 'line-through' : 'none',
        }),
    ),
};

const IstexView = ({ fieldStatus, field, resource }) => (
    <span style={styles.text(fieldStatus)}>
        {`${istexApiUrl}/?q=${resource[field.name]}`}
    </span>
);

IstexView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    field: fieldPropTypes.isRequired,
};

IstexView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default IstexView;
