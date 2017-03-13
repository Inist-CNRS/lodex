import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';
import { ToolbarGroup } from 'material-ui/Toolbar';
import ActionSearch from 'material-ui/svg-icons/action/search';
import CircularProgress from 'material-ui/CircularProgress';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { applyFilter as applyFilterAction } from './';
import { fromDataset } from '../selectors';

export const FilterComponent = ({ isDatasetLoading, handleFilterChange, p: polyglot }) => (
    <ToolbarGroup>
        {isDatasetLoading
            ? <CircularProgress className="dataset-loading" size={20} /> :
            <ActionSearch />
        }
        <TextField
            className="filter"
            hintText={polyglot.t('filter')}
            onChange={(_, e) => handleFilterChange(e)}
        />
    </ToolbarGroup>
);

FilterComponent.propTypes = {
    handleFilterChange: PropTypes.func.isRequired,
    isDatasetLoading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    isDatasetLoading: fromDataset.isDatasetLoading(state),
});

const mapDispatchToProps = ({
    applyFilter: applyFilterAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleFilterChange: ({ applyFilter }) => (match) => {
            applyFilter(match);
        },
    }),
    translate,
)(FilterComponent);
