// @ts-expect-error TS6133
import React from 'react';
import { translate } from '../../i18n/I18NContext';

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

interface TransformerListItemProps {
    transformer?: object;
    id: string;
    show: boolean;
    onRemove(...args: unknown[]): unknown;
    onEdit(...args: unknown[]): unknown;
    p: unknown;
}

const TransformerListItem = ({
    transformer,

    id,

    show,

    onRemove,

    onEdit,

    p: polyglot
}: TransformerListItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    // @ts-expect-error TS7006
    const renderChip = (name, value) => {
        if (value === undefined || value === null || value === '') {
            return (
                <Chip
                    key={name}
                    label={polyglot.t('empty')}
                    sx={{
                        fontStyle: 'italic',
                    }}
                />
            );
        }

        if (value === ' ') {
            return (
                <Chip
                    key={name}
                    label={polyglot.t('blank_space')}
                    sx={{
                        fontStyle: 'italic',
                    }}
                />
            );
        }

        // detect if value contains a space at the end of string
        if (value.endsWith(' ') || value.startsWith(' ')) {
            const replaceValue = value.replace(' ', '\u00a0');
            return (
                <Chip
                    key={name}
                    label={replaceValue}
                    sx={{ fontWeight: 'bold' }}
                />
            );
        }

        return (
            <Chip
                key={name}
                label={value}
                title={value}
                sx={{
                    color: 'text.primary',
                    fontWeight: 'bold',
                    maxWidth: 200,
                }}
            />
        );
    };

    // @ts-expect-error TS7006
    const renderTransformersArgs = (args) => {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/*
                 // @ts-expect-error TS7006 */}
                {args.map((item) => renderChip(item.name, item.value))}
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
                backgroundColor: 'neutralDark.veryLight',
                '&:hover': {
                    backgroundColor: 'neutralDark.lighter',
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
                        color: 'warning.main',
                    }}
                    onClick={() => {
                        onRemove();
                    }}
                />
            </Box>
        </Box>
    );
};

// @ts-expect-error TS2345
export default compose(translate)(TransformerListItem);
