import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';

import { Box, Grid, useMediaQuery } from '@mui/material';
import { useCanAnnotate } from '../../annotation/useCanAnnotate';
import SearchBar from '../../lib/components/searchbar/SearchBar';
import ToggleFacetsButton from '../../lib/components/searchbar/ToggleFacetsButton';
import useSearchBar from '../../lib/components/searchbar/useSearchBar';
import stylesToClassName from '../../lib/stylesToClassName';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import { fromSearch } from '../selectors';
import AnnotationsFilter from './AnnotationsFilter';
import { search as searchAction } from './reducer';
import VisitedResourcesFilter from './VisitedResourcesFilter';

const styles = stylesToClassName(
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
    const matches = useMediaQuery('@media (max-width: 991.5px)', {
        noSsr: true,
    });

    const showToggleFacetButton = matches && withFacets;

    const [localQuery, handleSearch, handleClearSearch] = useSearchBar(
        defaultQuery,
        search,
    );

    const canAnnotate = useCanAnnotate();

    if (!hasSearchableFields) {
        return null;
    }

    return (
        <Box
            sx={{
                paddingInlineStart: 2.5,
                paddingInlineEnd: 3,
            }}
        >
            <Grid container spacing={2}>
                <Grid
                    item
                    xs={showToggleFacetButton ? 11 : 12}
                    lg={canAnnotate ? 6 : 9}
                >
                    <SearchBar
                        className="search-searchbar"
                        value={localQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onClear={handleClearSearch}
                    />
                </Grid>

                {showToggleFacetButton && (
                    <Grid
                        item
                        xs={1}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ToggleFacetsButton
                            onChange={onToggleFacets}
                            className={styles.toggleFacetsButton}
                        />
                    </Grid>
                )}

                <Grid item xs={12} md={canAnnotate ? 6 : 12} lg={3}>
                    <VisitedResourcesFilter />
                </Grid>
                {canAnnotate && (
                    <Grid item xs={12} md={6} lg={3}>
                        <AnnotationsFilter />
                    </Grid>
                )}
            </Grid>
        </Box>
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
    onToggleFacets: PropTypes.func.isRequired,
    withFacets: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    hasSearchableFields: fromFields.hasSearchableFields(state),
    defaultQuery: fromSearch.getQuery(state),
});

const mapDispatchToProps = {
    search: (value) => searchAction({ query: value }),
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(SearchSearchBar);
