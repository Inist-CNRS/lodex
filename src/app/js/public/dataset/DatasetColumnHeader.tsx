// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from '@mui/material';
import { connect } from 'react-redux';

import { sortDataset as sortDatasetAction } from './';
import { fromDataset } from '../selectors';
import SortButton from '../../lib/components/SortButton';

// @ts-expect-error TS7031
const DatasetColumnHeader = ({ name, label, sortBy, sortDir, sortDataset }) => (
    <TableCell>
        {label === 'uri' ? (
            <span>#</span>
        ) : (
            <SortButton
                // @ts-expect-error TS2322
                className={`sort_${name}`}
                sort={sortDataset}
                name={name}
                sortBy={sortBy}
                sortDir={sortDir}
            >
                {label}
            </SortButton>
        )}
    </TableCell>
);

DatasetColumnHeader.defaultProps = {
    sortBy: null,
    sortDir: null,
};

DatasetColumnHeader.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortBy: PropTypes.string,
    sortDir: PropTypes.oneOf(['ASC', 'DESC']),
    sortDataset: PropTypes.func.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    ...fromDataset.getSort(state),
});

const mapDispatchToProps = {
    sortDataset: sortDatasetAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DatasetColumnHeader);
