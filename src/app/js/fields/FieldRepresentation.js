import React from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip, Checkbox, Typography } from '@mui/material';
import FieldInternalIcon from './FieldInternalIcon';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';

function FieldRepresentation({
    field,
    shortMode = false,
    p: polyglot,
    isFieldSelected,
    handleToggleSelectedField,
}) {
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
        <>
            <Box
                width="100%"
                maxWidth="100%"
                display="grid"
                gridTemplateColumns={
                    handleToggleSelectedField ? 'auto auto 1fr' : 'auto 1fr'
                }
                alignItems="center"
                gap={0.5}
            >
                {handleToggleSelectedField && (
                    <Checkbox
                        checked={isFieldSelected}
                        size="small"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleSelectedField();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        sx={{
                            paddingX: 0,
                        }}
                        disableRipple
                        aria-label={polyglot.t('select_field')}
                    />
                )}

                {field.name && (
                    <Typography variant="body2" sx={{ color: 'info.main' }}>
                        [{field.name}]
                    </Typography>
                )}

                {field.label && (
                    <Tooltip
                        title={field.label}
                        enterDelay={300}
                        placement="top"
                        arrow
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textWrap: 'nowrap',
                                textAlign: 'left',
                            }}
                        >
                            {field.label}
                        </Typography>
                    </Tooltip>
                )}
            </Box>

            {(field.internalScopes || field.internalName) && !shortMode && (
                <Box
                    width="100%"
                    maxWidth="100%"
                    display="grid"
                    gridTemplateColumns={
                        field.internalScopes && field.internalName
                            ? 'auto 1fr'
                            : '1fr'
                    }
                    gap={0.5}
                    color="text.secondary"
                >
                    {field.internalScopes && (
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="flex-end"
                            marginRight={1}
                        >
                            {field.internalScopes.map((internalScope) => (
                                <FieldInternalIcon
                                    key={internalScope}
                                    scope={internalScope}
                                    fontSize="small"
                                />
                            ))}
                        </Box>
                    )}

                    {field.internalName && (
                        <Tooltip
                            title={field.internalName}
                            enterDelay={300}
                            placement="top"
                            arrow
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    textWrap: 'nowrap',
                                    fontStyle: 'italic',
                                    textAlign: 'left',
                                }}
                            >
                                {field.internalName}
                            </Typography>
                        </Tooltip>
                    )}
                </Box>
            )}
        </>
    );
}

FieldRepresentation.propTypes = {
    field: PropTypes.object.isRequired,
    shortMode: PropTypes.bool,
    isFieldSelected: PropTypes.bool,
    handleToggleSelectedField: PropTypes.func,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldRepresentation);
