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

const SortableItem = ({ option, onDelete, isActive }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useSortable({
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

SortableItem.propTypes = {
    option: fieldPropTypes.isRequired,
    onDelete: PropTypes.func,
    isActive: PropTypes.bool,
};

const SortableChips = ({ onChange, onDelete, options }) => {
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
        }
        setActiveId(null);
    };

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
                items={options.map(option => option.name)}
                strategy={horizontalListSortingStrategy}
            >
                {options.map(option => (
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
                        option={options.find(
                            option => option.name === activeId,
                        )}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

SortableChips.propTypes = {
    options: PropTypes.arrayOf(fieldPropTypes).isRequired,
    onDelete: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
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
