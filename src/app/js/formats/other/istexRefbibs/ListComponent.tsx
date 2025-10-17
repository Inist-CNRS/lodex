// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash/memoize';

import { PropositionStatus, ISTEX_API_URL } from '@lodex/common';
import { field as fieldPropTypes } from '../../../propTypes';
import Link from '../../../lib/components/Link';

const styles = {
    text: memoize((status) =>
        Object.assign({
            fontSize: '1rem',
            textDecoration:
                status === PropositionStatus.REJECTED ? 'line-through' : 'none',
        }),
    ),
};

// @ts-expect-error TS7031
const IstexRefbibsView = ({ fieldStatus, field, resource }) => {
    const url = `${ISTEX_API_URL}/document/?q=${resource[field.name]}`;
    return (
        // @ts-expect-error TS2739
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
