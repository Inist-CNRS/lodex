import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Autocomplete,
    TextField,
    MenuItem,
    Chip,
} from '@mui/material';
import FieldRepresentation from './FieldRepresentation';
import { getFieldForSpecificScope } from '../../../common/scope';
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
    sortableKeyboardCoordinates,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useTranslate } from '../i18n/I18NContext';
import type { Field } from './types.ts';
import { useController, useFormContext } from 'react-hook-form';

interface SortableItemProps {
    option: {
        name: string;
    };
    onDelete(name: string): void;
    isActive?: boolean;
}

const SortableItem = ({ option, onDelete, isActive }: SortableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useSortable({
            id: option.name,
        });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition: 'transform 0ms ease',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Chip
                label={<FieldRepresentation field={option} />}
                onDelete={() => onDelete(option.name)}
                sx={{
                    '&': {
                        cursor: 'grab',
                        boxShadow: isActive
                            ? 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                            : 'none',
                        opacity: isDragging ? 0 : 1,
                    },
                }}
            />
        </div>
    );
};

interface SortableChipsProps {
    options: {
        name: string;
    }[];
    onDelete(name: string): void;
    onChange(values: { isComposedOf: boolean; fields: string[] }): void;
}

const SortableChips = ({ onChange, onDelete, options }: SortableChipsProps) => {
    const [activeId, setActiveId] = React.useState(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 2,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                distance: 2,
            },
        }),
    );

    // @ts-expect-error TS7006
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const oldIndex = options.findIndex(
                (option) => option.name === active.id,
            );
            const newIndex = options.findIndex(
                (option) => option.name === over.id,
            );
            const newFields = arrayMove(options, oldIndex, newIndex);
            onChange({
                isComposedOf: newFields.length > 0,
                fields: newFields.map((field) => field.name),
            });
        }
        setActiveId(null);
    };

    // @ts-expect-error TS7031
    const handleDragStart = ({ active }) => {
        if (!active) {
            return;
        }
        setActiveId(active.id);
    };

    const handleDragCancel = () => setActiveId(null);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
        >
            <SortableContext
                items={options.map((option) => option.name)}
                strategy={horizontalListSortingStrategy}
            >
                {options.map((option) => (
                    <SortableItem
                        key={option.name}
                        option={option}
                        onDelete={onDelete}
                    />
                ))}
            </SortableContext>
            <DragOverlay>
                {activeId ? (
                    <SortableItem
                        isActive={true}
                        // @ts-expect-error TS7006
                        option={options.find(
                            (option) => option.name === activeId,
                        )}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

const FieldComposedOf = ({
    fields,
    scope,
    subresourceId,
}: {
    fields: Field[];
    scope: string;
    subresourceId?: string;
}) => {
    const { translate } = useTranslate();

    const { control } = useFormContext();
    const { field } = useController({
        name: 'composedOf',
        control,
        defaultValue: {
            isComposedOf: false,
            fields: [],
        },
    });
    const columns = field.value.fields;

    const options = useMemo(() => {
        const toReturn = getFieldForSpecificScope(fields, scope, subresourceId);
        toReturn.filter(Boolean);
        for (const column of columns) {
            if (
                // @ts-expect-error TS7006
                toReturn.filter((field) => field.name === column).length === 0
            ) {
                toReturn.push({
                    name: column,
                    internalName: translate('missing_field'),
                });
            }
        }
        return toReturn;
    }, [fields, scope, subresourceId, columns]);

    const autocompleteValue = useMemo(() => {
        // @ts-expect-error TS7006
        return columns.map((column) => {
            // @ts-expect-error TS7006
            return options.find((field) => field.name === column);
        });
    }, [columns, options]);

    // @ts-expect-error TS7006
    const onDelete = (name) => {
        // @ts-expect-error TS7006
        const newFields = columns.filter((column) => column !== name);
        field.onChange({
            isComposedOf: newFields.length > 0,
            fields: newFields,
        });
    };

    // @ts-expect-error TS7006
    const handleChange = (event, value) => {
        field.onChange({
            isComposedOf: value.length > 0,
            // @ts-expect-error TS7006
            fields: value.map((field) => field.name),
        });
    };

    return (
        <Box mt={5}>
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                {translate('wizard_composed_of')}
            </Typography>
            <Autocomplete
                multiple
                fullWidth
                options={options}
                value={autocompleteValue ?? []}
                isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={translate('fields_composed_of')}
                    />
                )}
                renderOption={(props, option) => (
                    <MenuItem
                        sx={{
                            '&.MuiAutocomplete-option': {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            },
                        }}
                        {...props}
                    >
                        <FieldRepresentation field={option} />
                    </MenuItem>
                )}
                onChange={handleChange}
                renderTags={(props) => (
                    <SortableChips
                        onChange={field.onChange}
                        onDelete={onDelete}
                        options={props}
                    />
                )}
            />
        </Box>
    );
};

export default FieldComposedOf;
