import React from 'react';
import colorsTheme from '../../../custom/colorsTheme';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { Box, Chip, Typography } from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { compose } from 'recompose';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const TransformerListItem = ({
    transformer,
    id,
    show,
    onRemove,
    onEdit,
    p: polyglot,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const renderChip = (name, value) => {
        if (value === undefined || value === null || value === '') {
            return <Chip key={name} label={polyglot.t('empty')} />;
        }

        if (value === ' ') {
            return <Chip key={name} label={polyglot.t('blank_space')} />;
        }

        return (
            <Chip
                key={name}
                label={value}
                sx={{ color: 'text.primary', fontWeight: 'bold' }}
            />
        );
    };

    const renderTransformersArgs = args => {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {args.map(item => renderChip(item.name, item.value))}
            </Box>
        );
    };
    const dragStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (!show) {
        return null;
    }

    return (
        <Box
            ref={setNodeRef}
            style={{ ...dragStyle }}
            {...attributes}
            {...listeners}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1,
                marginBottom: 2,
                borderRadius: 1,
                backgroundColor: colorsTheme.black.veryLight,
                '&:hover': {
                    backgroundColor: colorsTheme.black.lighter,
                },
            }}
        >
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <DragIndicatorIcon sx={{ cursor: 'grab', marginRight: 1 }} />
                <Typography noWrap sx={{ marginRight: 1 }}>
                    {transformer?.operation}
                </Typography>
                {transformer?.args && renderTransformersArgs(transformer.args)}
            </Box>
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <EditIcon
                    aria-label={`transformer-edit-${id}`}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => onEdit()}
                />
                <DeleteIcon
                    aria-label={`transformer-delete-${id}`}
                    sx={{
                        cursor: 'pointer',
                        color: colorsTheme.orange.primary,
                    }}
                    onClick={() => {
                        onRemove();
                    }}
                />
            </Box>
        </Box>
    );
};

TransformerListItem.propTypes = {
    transformer: PropTypes.object,
    id: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onRemove: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(TransformerListItem);
