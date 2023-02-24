import React from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip, Typography } from '@mui/material';
import FieldInternalIcon from './FieldInternalIcon';

export default function FieldRepresentation({ field, shortMode = false }) {
    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" maxWidth="300px">
                {field.label && (
                    <Tooltip title={field.label}>
                        <Typography noWrap marginRight={1} variant="body2">
                            {field.label}
                        </Typography>
                    </Tooltip>
                )}
                {field.name && (
                    <Typography variant="body2" sx={{ color: 'info.main' }}>
                        [{field.name}]
                    </Typography>
                )}
            </Box>
            {(field.internalScopes || field.internalName) && !shortMode && (
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="flex-end"
                    marginTop={1}
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="flex-end"
                        marginRight={1}
                    >
                        {field.internalScopes &&
                            field.internalScopes.map(internalScope => (
                                <FieldInternalIcon
                                    key={internalScope}
                                    scope={internalScope}
                                    fontSize="small"
                                    color="neutral"
                                />
                            ))}
                    </Box>
                    <Typography
                        variant="body2"
                        color="neutral"
                        sx={{ color: 'neutral.main' }}
                    >
                        {field.internalName}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

FieldRepresentation.propTypes = {
    field: PropTypes.isRequired,
    shortMode: PropTypes.bool,
};
