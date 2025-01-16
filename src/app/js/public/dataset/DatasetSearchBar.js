import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { applyFilter as applyFilterAction } from '.';
import { fromDataset } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import stylesToClassname from '../../lib/stylesToClassName';
import SearchBar from '../../lib/components/searchbar/SearchBar';
import ToggleFacetsButton from '../../lib/components/searchbar/ToggleFacetsButton';
import useSearchBar from '../../lib/components/searchbar/useSearchBar';
import { Box } from '@mui/material';

const styles = stylesToClassname(
    {
        toggleFacetsButton: {
            '@media (min-width: 992px)': {
                display: 'none !important',
            },
        },
    },
    'dataset-searchbar',
);

const DatasetSearchBar = ({
    defaultQuery,
    search,
    hasSearchableFields,
    onToggleFacets,
}) => {
    if (!hasSearchableFields) {
        return null;
    }

    const [localQuery, handleSearch, handleClearSearch] = useSearchBar(
        defaultQuery,
        search,
    );

    return (
        <Box display="flex">
            <Box flexGrow={1}>
                <SearchBar
                    className="dataset-searchbar"
                    value={localQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onClear={handleClearSearch}
                />
            </Box>
            <ToggleFacetsButton
                onChange={onToggleFacets}
                className={styles.toggleFacetsButton}
            />
        </Box>
    );
};

DatasetSearchBar.defaultProps = {
    defaultQuery: '',
};

DatasetSearchBar.propTypes = {
    p: polyglotPropTypes.isRequired,
    hasSearchableFields: PropTypes.bool.isRequired,
    search: PropTypes.func.isRequired,
    defaultQuery: PropTypes.string,
    onToggleFacets: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    hasSearchableFields: fromFields.hasSearchableFields(state),
    defaultQuery: fromDataset.getFilter(state),
});

const mapDispatchToProps = {
    search: applyFilterAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DatasetSearchBar);
