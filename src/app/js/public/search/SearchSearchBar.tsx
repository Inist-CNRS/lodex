import { useEffect } from 'react';
import { connect } from 'react-redux';

import { Box, Grid, useMediaQuery } from '@mui/material';
import { useCanAnnotate } from '../../annotation/useCanAnnotate';
import SearchBar from '../../lib/components/searchbar/SearchBar';
import ToggleFacetsButton from '../../lib/components/searchbar/ToggleFacetsButton';
import useSearchBar from '../../lib/components/searchbar/useSearchBar';
import stylesToClassName from '../../lib/stylesToClassName';
import { fromFields } from '../../sharedSelectors';
import { fromSearch } from '../selectors';
import AnnotationsFilter from './AnnotationsFilter';
import { search as searchAction, searchAnnotations } from './reducer';
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

type SearchSearchBarComponentProps = {
    p: unknown;
    hasSearchableFields: boolean;
    search(...args: unknown[]): unknown;
    defaultQuery?: string;
    onToggleFacets(...args: unknown[]): unknown;
    withFacets?: boolean;
    resetAnnotationFilter(...args: unknown[]): unknown;
};

export const SearchSearchBarComponent = ({
    defaultQuery = '',
    search,
    hasSearchableFields,
    onToggleFacets,
    withFacets,
    resetAnnotationFilter,
}: SearchSearchBarComponentProps) => {
    const matches = useMediaQuery('@media (max-width: 991.5px)', {
        noSsr: true,
    });

    const showToggleFacetButton = matches && withFacets;

    const [localQuery, handleSearch, handleClearSearch] = useSearchBar(
        defaultQuery,
        search,
    );

    const canAnnotate = useCanAnnotate();

    useEffect(() => {
        if (!canAnnotate) {
            resetAnnotationFilter();
        }
    }, [canAnnotate, resetAnnotationFilter]);

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
                        // @ts-expect-error TS2322
                        className="search-searchbar"
                        value={localQuery}
                        // @ts-expect-error TS7006
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
                            // @ts-expect-error TS2339
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    hasSearchableFields: fromFields.hasSearchableFields(state),
    defaultQuery: fromSearch.getQuery(state),
});

const mapDispatchToProps = {
    // @ts-expect-error TS7006
    search: (value) => searchAction({ query: value }),
    resetAnnotationFilter: () => searchAnnotations({ mode: null }),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SearchSearchBarComponent);
