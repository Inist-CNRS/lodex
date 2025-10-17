// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash/memoize';

import { PropositionStatus } from '@lodex/common';
import { field as fieldPropTypes } from '../../../propTypes';
import { getSiteUrl } from '../../utils/fetchIstexData';

const styles = {
    text: memoize((status) => ({
        fontSize: '1rem',
        textDecoration:
            status === PropositionStatus.REJECTED ? 'line-through' : 'none',
    })),
};

// @ts-expect-error TS7031
const IstexSummaryList = ({ fieldStatus, field, resource }) => {
    const url = getSiteUrl(resource[field.name]);

    return (
        <a
            style={styles.text(fieldStatus)}
            href={`${url}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {url}
        </a>
    );
};

IstexSummaryList.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired,
    field: fieldPropTypes.isRequired,
};

IstexSummaryList.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default IstexSummaryList;
