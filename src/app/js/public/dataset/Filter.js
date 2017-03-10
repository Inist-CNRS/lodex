import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import { ToolbarGroup } from 'material-ui/Toolbar';
import ActionSearch from 'material-ui/svg-icons/action/search';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { filterDataset as filterDatasetAction } from './';
import { fromDataset } from '../selectors';

export const FilterComponent = ({ filtering, handleFilterChange, p: polyglot }) => (
    <ToolbarGroup>
        <ActionSearch />
        <TextField
            hintText={polyglot.t('filter')}
            onChange={(_, e) => handleFilterChange(e)}
        />
        {filtering && <CircularProgress size={30} />}
    </ToolbarGroup>
);

FilterComponent.propTypes = {
    handleFilterChange: PropTypes.func.isRequired,
    filtering: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};


const mapStateToProps = state => ({
    filtering: fromDataset.isDatasetFiltering(state),
    currentPage: fromDataset.getDatasetCurrentPage(state),
    perPage: fromDataset.getDatasetPerPage(state),
});

const mapDispatchToProps = ({
    filterDataset: filterDatasetAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleFilterChange: ({ currentPage, perPage, filterDataset }) => (match) => {
            filterDataset({ page: currentPage, perPage, match });
        },
    }),
    translate,
)(FilterComponent);
