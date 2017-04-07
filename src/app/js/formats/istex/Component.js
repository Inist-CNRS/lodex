import React, { PropTypes } from 'react';
import memoize from 'lodash.memoize';

import FetchIstexDataHOC from './FetchIstexDataHOC';
import { REJECTED } from '../../../../common/propositionStatus';

const styles = {
    text: memoize(status => Object.assign({
        fontSize: '1.5rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    })),
};

const IstexView = ({ fieldStatus, data }) => (
    <span style={styles.text(fieldStatus)}>
        {
            JSON.stringify(data, null, 4)
        }
    </span>
);

IstexView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    data: PropTypes.shape({}),
};

IstexView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
};

export default FetchIstexDataHOC(IstexView);
