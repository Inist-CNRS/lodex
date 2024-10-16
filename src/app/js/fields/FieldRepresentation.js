import React from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip, Typography } from '@mui/material';
import FieldInternalIcon from './FieldInternalIcon';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';

function FieldRepresentation({ field, shortMode = false, p: polyglot }) {
    if (!field) {
        return (
            <Typography
                noWrap
                marginRight={1}
                variant="body2"
                sx={{ color: 'neutralDark.light' }}
            >
                {polyglot.t('field_not_found')}
            </Typography>
        );
    }
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
                    color="text.secondary"
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="flex-end"
                        marginRight={1}
                    >
                        {field.internalScopes &&
                            field.internalScopes.map((internalScope) => (
                                <FieldInternalIcon
                                    key={internalScope}
                                    scope={internalScope}
                                    fontSize="small"
                                />
                            ))}
                    </Box>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {field.internalName}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

FieldRepresentation.propTypes = {
    field: PropTypes.object.isRequired,
    shortMode: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldRepresentation);
