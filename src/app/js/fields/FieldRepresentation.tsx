import { Box, Checkbox, Tooltip, Typography, useTheme } from '@mui/material';
// @ts-expect-error TS6133
import React from 'react';
import { AnnotationDisabledIcon } from '../annotation/AnnotationDisabledIcon';
import { translate, useTranslate } from '../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../propTypes';
import FieldInternalIcon from './FieldInternalIcon';

interface FieldRepresentationProps {
    field: object;
    shortMode?: boolean;
    isFieldSelected?: boolean;
    handleToggleSelectedField?(...args: unknown[]): unknown;
    p: unknown;
    showNotAnnotableIcon?: boolean;
}

function FieldRepresentation({
    field,

    shortMode = false,
    showNotAnnotableIcon = false,

    p: polyglot,

    isFieldSelected,

    handleToggleSelectedField
}: FieldRepresentationProps) {
    const { translate } = useTranslate();
    const theme = useTheme();
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
                gridTemplateColumns={`${handleToggleSelectedField ? 'auto ' : ''}auto 1fr ${showNotAnnotableIcon ? ' auto' : ''}`}
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

                {showNotAnnotableIcon && field.annotable === false && (
                    <Tooltip title={translate('annotation_disabled_tooltip')}>
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: -0.5,
                            }}
                        >
                            <AnnotationDisabledIcon
                                fill={theme.palette.grey[500]}
                            />
                        </Box>
                    </Tooltip>
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
                    {field.internalScopes?.length > 0 && (
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="flex-end"
                            marginRight={1}
                        >
                            {/*
                             // @ts-expect-error TS7006 */}
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

export default translate(FieldRepresentation);
