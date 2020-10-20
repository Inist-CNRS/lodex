import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import { fromSearch } from '../selectors';
import { search as searchAction } from './reducer';
import ExportButton from '../ExportButton';
import stylesToClassname from '../../lib/stylesToClassName';
import SearchBar from '../../lib/components/searchbar/SearchBar';
import ToggleFacetsButton from '../../lib/components/searchbar/ToggleFacetsButton';
import useSearchBar from '../../lib/components/searchbar/useSearchBar';

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
    defaultQuery,
    search,
    hasSearchableFields,
    onToggleFacets,
    withFacets,
}) => {
    if (!hasSearchableFields) {
        return null;
    }

    const [localQuery, handleSearch, handleClearSearch] = useSearchBar(
        defaultQuery,
        search,
    );

    return (
        <SearchBar
            className="search-searchbar"
            value={localQuery}
            onChange={e => handleSearch(e.target.value)}
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
    defaultQuery: '',
};

SearchSearchBar.propTypes = {
    p: polyglotPropTypes.isRequired,
    hasSearchableFields: PropTypes.bool.isRequired,
    search: PropTypes.func.isRequired,
    defaultQuery: PropTypes.string,
    withFacets: PropTypes.bool.isRequired,
    onToggleFacets: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    hasSearchableFields: fromFields.hasSearchableFields(state),
    defaultQuery: fromSearch.getQuery(state),
});

const mapDispatchToProps = {
    search: value => searchAction({ query: value }),
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(SearchSearchBar);
