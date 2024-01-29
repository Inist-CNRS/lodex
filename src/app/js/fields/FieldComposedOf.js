import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Autocomplete,
    TextField,
    MenuItem,
    Chip,
} from '@mui/material';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';

import { FIELD_FORM_NAME } from './';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';
import FieldRepresentation from './FieldRepresentation';
import { getFieldForSpecificScope } from '../../../common/scope';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    PointerSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

const SortableChips = ({ onChange, onDelete, options }) => {
    const [activeId, setActiveId] = React.useState(null);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 6,
            },
        }),
    );
    const handleDragEnd = event => {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            const oldIndex = options.findIndex(
                option => option.name === active.id,
            );
            const newIndex = options.findIndex(
                option => option.name === over.id,
            );
            const newFields = arrayMove(options, oldIndex, newIndex);
            onChange({
                isComposedOf: newFields.length > 0,
                fields: newFields.map(field => field.name),
            });

            setActiveId(null);
        }
    };

    const handleDragStart = ({ active }) => {
        setActiveId(active.id);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <SortableContext
                items={options}
                strategy={verticalListSortingStrategy}
            >
                {options.map((option, i) => (
                    <SortableItem key={i} option={option} onDelete={onDelete} />
                ))}
            </SortableContext>
            <DragOverlay>
                {activeId ? (
                    <SortableItem
                        option={options.find(
                            option => option.name === activeId,
                        )}
                        onDelete={onDelete}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

const SortableItem = ({ option, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: option.name });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isDragging ? 'grabbing' : 'pointer',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Chip
                label={<FieldRepresentation field={option} />}
                onDelete={() => onDelete(option.name)}
            />
        </div>
    );
};

const FieldComposedOf = ({
    onChange,
    fields,
    p: polyglot,
    columns,
    scope,
    subresourceId,
}) => {
    const autocompleteValue = columns.map(column => {
        return fields.find(field => field.name === column);
    });

    const onDelete = name => {
        const newFields = columns.filter(column => column !== name);
        onChange({
            isComposedOf: newFields.length > 0,
            fields: newFields,
        });
    };

    const handleChange = (event, value) => {
        onChange({
            isComposedOf: value.length > 0,
            fields: value.map(field => field.name),
        });
    };

    return (
        <Box mt={5}>
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                {polyglot.t('wizard_composed_of')}
            </Typography>
            <Autocomplete
                multiple
                fullWidth
                options={getFieldForSpecificScope(fields, scope, subresourceId)}
                value={autocompleteValue ?? []}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={polyglot.t('fields_composed_of')}
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
                renderTags={props => (
                    <SortableChips
                        onChange={onChange}
                        onDelete={onDelete}
                        options={props}
                    />
                )}
            />
        </Box>
    );
};

FieldComposedOf.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    scope: PropTypes.string.isRequired,
    subresourceId: PropTypes.string,
};

FieldComposedOf.defaultProps = {
    columns: [],
};

const mapStateToProps = (state, { FORM_NAME }) => {
    const composedOf = formValueSelector(FORM_NAME || FIELD_FORM_NAME)(
        state,
        'composedOf',
    );

    if (composedOf && composedOf.fields && composedOf.fields.length > 0) {
        return {
            columns: composedOf.fields,
        };
    }
    return { columns: [] };
};

const mapDispatchToProps = (dispatch, { FORM_NAME = FIELD_FORM_NAME }) => ({
    onChange: composedOf => {
        dispatch(change(FORM_NAME, 'composedOf', composedOf));
    },
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(FieldComposedOf);
