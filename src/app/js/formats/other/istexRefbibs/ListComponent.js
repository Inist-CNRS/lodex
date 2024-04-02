import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash/memoize';

import { REJECTED } from '../../../../../common/propositionStatus';
import { field as fieldPropTypes } from '../../../propTypes';
import { ISTEX_API_URL } from '../../../../../common/externals';
import Link from '../../../lib/components/Link';

const styles = {
    text: memoize((status) =>
        Object.assign({
            fontSize: '1rem',
            textDecoration: status === REJECTED ? 'line-through' : 'none',
        }),
    ),
};

const IstexRefbibsView = ({ fieldStatus, field, resource }) => {
    const url = `${ISTEX_API_URL}/document/?q=${resource[field.name]}`;
    return (
        <Link style={styles.text(fieldStatus)} href={`${url}`}>
            {url}
        </Link>
    );
};

IstexRefbibsView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired,
    field: fieldPropTypes.isRequired,
};

IstexRefbibsView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default IstexRefbibsView;
