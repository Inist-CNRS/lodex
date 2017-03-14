import React, { PropTypes } from 'react';
import { TableHeaderColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import {
    sortDataset as sortDatasetAction,
} from './';
import { fromDataset } from '../selectors';

const styles = {
    sortButton: {
        minWidth: 40,
    },
};

const DatasetColumnHeader = ({ name, label, sortBy, sortDir, sortDataset }) => (
    <TableHeaderColumn>
        <FlatButton
            className={`sort_${name}`}
            labelPosition="before"
            onClick={sortDataset}
            label={label}
            icon={sortBy === name ?
                <ContentSort style={sortDir === 'ASC' ? { transform: 'rotate(180deg)' } : {}} /> : false
            }
            style={styles.sortButton}
        />
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

const mapDispatchToProps = ({
    sortDataset: sortDatasetAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        sortDataset: ({ sortDataset, name }) => () => sortDataset(name),
    }),
)(DatasetColumnHeader);
