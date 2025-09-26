import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';

import { Grid, useMediaQuery } from '@mui/material';
import { applyFilter as applyFilterAction } from '.';
import SearchBar from '../../lib/components/searchbar/SearchBar';
import ToggleFacetsButton from '../../lib/components/searchbar/ToggleFacetsButton';
import useSearchBar from '../../lib/components/searchbar/useSearchBar';
import stylesToClassname from '../../lib/stylesToClassName';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import { fromDataset } from '../selectors';

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
    // @ts-expect-error TS7031
    defaultQuery,
    // @ts-expect-error TS7031
    search,
    // @ts-expect-error TS7031
    hasSearchableFields,
    // @ts-expect-error TS7031
    onToggleFacets,
}) => {
    const showToggleFacetButton = useMediaQuery('@media (max-width: 991.5px)', {
        noSsr: true,
    });

    const [localQuery, handleSearch, handleClearSearch] = useSearchBar(
        defaultQuery,
        search,
    );

    if (!hasSearchableFields) {
        return null;
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={showToggleFacetButton ? 11 : 12}>
                <SearchBar
                    // @ts-expect-error TS2322
                    className="dataset-searchbar"
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
        </Grid>
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    hasSearchableFields: fromFields.hasSearchableFields(state),
    // @ts-expect-error TS2339
    defaultQuery: fromDataset.getFilter(state),
});

const mapDispatchToProps = {
    search: applyFilterAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
    // @ts-expect-error TS2345
)(DatasetSearchBar);
