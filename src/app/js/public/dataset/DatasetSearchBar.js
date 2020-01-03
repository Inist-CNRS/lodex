import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import debounce from 'lodash.debounce';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { applyFilter as applyFilterAction } from '.';
import { fromDataset } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import stylesToClassname from '../../lib/stylesToClassName';
import SearchBar from '../../lib/components/searchbar/SearchBar';
import ToggleFacetsButton from '../../lib/components/searchbar/ToggleFacetsButton';

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
    query,
    search,
    hasSearchableFields,
    onToggleFacets,
}) => {
    if (!hasSearchableFields) {
        return null;
    }

    const [localQuery, setLocalQuery] = useState(query || '');

    const debouncedSearch = useCallback(
        debounce(value => {
            search(value);
        }, 500),
        [],
    );

    const handleSearch = (_, value) => {
        setLocalQuery(value);
        debouncedSearch(value);
    };

    const handleClearSearch = () => {
        handleSearch(null, '');
    };

    return (
        <SearchBar
            className="dataset-searchbar"
            value={localQuery}
            onChange={handleSearch}
            onClear={handleClearSearch}
            actions={
                <ToggleFacetsButton
                    onChange={onToggleFacets}
                    className={styles.toggleFacetsButton}
                />
            }
        />
    );
};

DatasetSearchBar.defaultProps = {
    query: '',
};

DatasetSearchBar.propTypes = {
    p: polyglotPropTypes.isRequired,
    hasSearchableFields: PropTypes.bool.isRequired,
    search: PropTypes.func.isRequired,
    query: PropTypes.string,
    onToggleFacets: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    hasSearchableFields: fromFields.hasSearchableFields(state),
    query: fromDataset.getFilter(state),
});

const mapDispatchToProps = {
    search: applyFilterAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DatasetSearchBar);
