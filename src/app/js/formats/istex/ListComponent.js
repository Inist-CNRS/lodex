import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash.memoize';

import { REJECTED } from '../../../../common/propositionStatus';
import { field as fieldPropTypes } from '../../propTypes';
import { ISTEX_API_URL } from '../../../../common/externals';
import Link from '../../lib/components/Link';

const styles = {
    text: memoize(status =>
        Object.assign({
            fontSize: '1.5rem',
            textDecoration: status === REJECTED ? 'line-through' : 'none',
        }),
    ),
};

const IstexView = ({ fieldStatus, field, resource }) => {
    const url = `${ISTEX_API_URL}/document/?q=${resource[field.name]}`;
    return (
        <Link style={styles.text(fieldStatus)} href={`${url}`}>
            {url}
        </Link>
    );
};

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
