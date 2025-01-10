import { Box, Checkbox, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../propTypes';
import FieldInternalIcon from './FieldInternalIcon';

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
                        <Tooltip
                            title={field.label}
                            enterDelay={300}
                            placement="top"
                            arrow
                        >
                            <span>{field.label}</span>
                        </Tooltip>
                    </Typography>
                )}
            </Box>

            {(field.internalScopes || field.internalName) && !shortMode && (
                <Box
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
                            <Tooltip
                                title={field.internalName}
                                enterDelay={300}
                                placement="top"
                                arrow
                            >
                                <span>{field.internalName}</span>
                            </Tooltip>
                        </Typography>
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
