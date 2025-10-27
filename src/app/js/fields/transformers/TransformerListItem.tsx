import { Box, Chip, Typography } from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useTranslate } from '../../i18n/I18NContext';

interface TransformerListItemProps {
    transformer?: object;
    id: string;
    show: boolean;
    onRemove(...args: unknown[]): unknown;
    onEdit(...args: unknown[]): unknown;
}

const TransformerListItem = ({
    transformer,
    id,
    show,
    onRemove,
    onEdit,
}: TransformerListItemProps) => {
    const { translate } = useTranslate();
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    // @ts-expect-error TS7006
    const renderChip = (name, value) => {
        if (value === undefined || value === null || value === '') {
            return (
                <Chip
                    key={name}
                    label={translate('empty')}
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
                    label={translate('blank_space')}
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
                    {/*
                     // @ts-expect-error TS2339 */}
                    {transformer?.operation}
                </Typography>
                {/*
                 // @ts-expect-error TS2339 */}
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

export default TransformerListItem;
