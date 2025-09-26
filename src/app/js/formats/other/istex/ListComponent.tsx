import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import memoize from 'lodash/memoize';

import { REJECTED } from '../../../../../common/propositionStatus';
import { field as fieldPropTypes } from '../../../propTypes';
import { ISTEX_API_URL } from '../../../../../common/externals';
import Link from '../../../lib/components/Link';

const styles = {
    // @ts-expect-error TS7006
    text: memoize((status) => ({
        fontSize: '1rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    })),
};

// @ts-expect-error TS7031
const IstexView = ({ fieldStatus, field, resource }) => {
    const url = `${ISTEX_API_URL}/document/?q=${resource[field.name]}`;
    return (
        // @ts-expect-error TS2739
        <Link style={styles.text(fieldStatus)} href={`${url}`}>
            {url}
        </Link>
    );
};

IstexView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired,
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
