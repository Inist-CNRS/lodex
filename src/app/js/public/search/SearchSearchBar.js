import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import debounce from 'lodash.debounce';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import { fromSearch } from '../selectors';
import { search as searchAction } from './reducer';
import ExportButton from '../ExportButton';
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
    'search-searchbar',
);

const SearchSearchBar = ({
    query,
    search,
    hasSearchableFields,
    onToggleFacets,
    withFacets,
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
            className="search-searchbar"
            value={localQuery}
            onChange={handleSearch}
            onClear={handleClearSearch}
            actions={
                <>
                    {withFacets && (
                        <ToggleFacetsButton
                            onChange={onToggleFacets}
                            className={styles.toggleFacetsButton}
                        />
                    )}
                    <ExportButton />
                </>
            }
        />
    );
};

SearchSearchBar.defaultProps = {
    query: '',
};

SearchSearchBar.propTypes = {
    p: polyglotPropTypes.isRequired,
    hasSearchableFields: PropTypes.bool.isRequired,
    search: PropTypes.func.isRequired,
    query: PropTypes.string,
    withFacets: PropTypes.bool.isRequired,
    onToggleFacets: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    hasSearchableFields: fromFields.hasSearchableFields(state),
    query: fromSearch.getQuery(state),
});

const mapDispatchToProps = {
    search: value => searchAction({ query: value }),
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(SearchSearchBar);
