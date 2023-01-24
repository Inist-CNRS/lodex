import React from 'react';
import colorsTheme from '../../../custom/colorsTheme';
import PropTypes from 'prop-types';

import { Box, Typography } from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

const TransformerListItem = ({ transformer, id, show, onRemove, onEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

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
                <Typography noWrap>
                    {transformer?.operation}
                    {transformer?.args &&
                        `(${Array.prototype.map
                            .call(transformer?.args, arg => arg.value)
                            .toString()})`}
                </Typography>
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
};

export default TransformerListItem;
