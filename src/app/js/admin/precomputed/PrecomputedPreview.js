import React from 'react';
import translate from 'redux-polyglot/translate';
import PreviewIcon from '@mui/icons-material/Preview';
import PropTypes from 'prop-types';

import { Box, Typography } from '@mui/material';
import { compose } from 'recompose';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const PrecomputedPreview = ({ lines, sourceColumns, p: polyglot }) => {
    return (
        <Box
            id="value-preview"
            sx={{
                background: 'var(--neutral-dark-very-light)',
                padding: 2,
                borderRadius: 2,
            }}
        >
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={4}
            >
                <PreviewIcon mr={1} />
                <Typography variant="h6">
                    {polyglot.t('value_preview_title')}
                </Typography>
            </Box>

            <Box textAlign={'center'} mb={2}>
                <Typography variant="body1">
                    {sourceColumns && sourceColumns.join(' | ')}
                </Typography>
            </Box>
            <Box mb={4}>
                {lines.length > 0 &&
                    lines?.map((line, index) => (
                        <Box key={index} mb={3}>
                            <Typography
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical',
                                }}
                                title={JSON.stringify(line)}
                            >
                                {Object.values(line)
                                    .map((value) =>
                                        value !== undefined
                                            ? JSON.stringify(value)
                                            : 'undefined',
                                    )
                                    .join(' | ')}
                            </Typography>
                        </Box>
                    ))}
                {lines.length === 0 && (
                    <Box textAlign={'center'} mb={2}>
                        <Typography variant="body1">
                            {polyglot.t('preview_no_data')}
                        </Typography>
                    </Box>
                )}
            </Box>
            <Box mb={1}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    {polyglot.t('precomputed_preview_description')}
                </Typography>
            </Box>
        </Box>
    );
};

PrecomputedPreview.propTypes = {
    lines: PropTypes.array.isRequired,
    sourceColumns: PropTypes.arrayOf(PropTypes.string),
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(PrecomputedPreview);
