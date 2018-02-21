import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash.memoize';

import { REJECTED } from '../../../../common/propositionStatus';
import { field as fieldPropTypes } from '../../propTypes';
import { ISTEX_API_URL as istexApiUrl } from '../../../../common/externals';

const styles = {
    text: memoize(status =>
        Object.assign({
            fontSize: '1.5rem',
            textDecoration: status === REJECTED ? 'line-through' : 'none',
        }),
    ),
};

const IstexView = ({ fieldStatus, field, resource }) => {
    const url = `${istexApiUrl}/?q=${resource[field.name]}`;
    return (
        <a style={styles.text(fieldStatus)} href={`${url}`}>
            {url}
        </a>
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
