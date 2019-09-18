import React from 'react';
import PropTypes from 'prop-types';
import { TableHeaderColumn } from '@material-ui/core';
import { connect } from 'react-redux';

import { sortDataset as sortDatasetAction } from './';
import { fromDataset } from '../selectors';
import SortButton from '../../lib/components/SortButton';

const DatasetColumnHeader = ({ name, label, sortBy, sortDir, sortDataset }) => (
    <TableHeaderColumn>
        {label === 'uri' ? (
            <span>#</span>
        ) : (
            <SortButton
                className={`sort_${name}`}
                sort={sortDataset}
                name={name}
                label={label}
                sortBy={sortBy}
                sortDir={sortDir}
            />
        )}
    </TableHeaderColumn>
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

const mapStateToProps = state => ({
    ...fromDataset.getSort(state),
});

const mapDispatchToProps = {
    sortDataset: sortDatasetAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DatasetColumnHeader);
