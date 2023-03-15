import { Box } from '@mui/material';
import React from 'react';
import SearchStats from './SearchStats';
import PropTypes from 'prop-types';
import ExportButton from '../ExportButton';
import stylesToClassName from '../../lib/stylesToClassName';
import ToggleFacetsButton from '../../lib/components/searchbar/ToggleFacetsButton';

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

const SearchResultHeader = ({
    displayStats,
    withFacets,
    onToggleFacets,
    sortComponent,
}) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent={displayStats ? 'space-between' : 'flex-end'}
            sx={{
                flexDirection: {
                    xs: 'column',
                    md: 'row',
                },
            }}
        >
            {displayStats && <SearchStats />}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
            >
                {withFacets && (
                    <Box>
                        <ToggleFacetsButton
                            onChange={onToggleFacets}
                            className={styles.toggleFacetsButton}
                        />
                    </Box>
                )}
                <Box>{sortComponent}</Box>
                <Box>
                    <ExportButton />
                </Box>
            </Box>
        </Box>
    );
};

SearchResultHeader.propTypes = {
    displayStats: PropTypes.bool,
    withFacets: PropTypes.bool,
    onToggleFacets: PropTypes.func,
    sortComponent: PropTypes.node,
};

export default SearchResultHeader;
