import { Box } from '@mui/material';
import React from 'react';
import SearchStats from './SearchStats';
import PropTypes from 'prop-types';
import ExportButton from '../ExportButton';

const SearchResultHeader = ({ displayStats, sortComponent }) => {
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
                gap={2}
                sx={{
                    gap: {
                        xs: 0,
                        md: 2,
                    },
                    flexDirection: {
                        xs: 'column',
                        md: 'row',
                    },
                    justifyContent: {
                        xs: 'flex-start',
                        md: 'space-between',
                    },
                    alignItems: {
                        xs: 'flex-start',
                        md: 'center',
                    },
                }}
            >
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
    sortComponent: PropTypes.node,
};

export default SearchResultHeader;
