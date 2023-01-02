import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Switch, Button, FormControlLabel } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';

import { FIELD_FORM_NAME } from './';
import ComposedOfColumn from './ComposedOfColumn';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const styles = {
    compositionContainer: {
        display: 'flex',
    },
    select: {
        flexGrow: 2,
    },
    header: {
        paddingLeft: 0,
    },
};

const FieldComposedOf = ({
    onChange,
    isComposedOf,
    fields,
    p: polyglot,
    columns,
}) => {
    // We convert the columns array to an array of objects because dnd-kit not handle empty values
    const [items, setItems] = useState(
        columns.map((column, index) => ({
            id: index + 1,
            value: column,
        })),
    );

    useEffect(() => {
        setItems(
            columns.map((column, index) => ({
                id: index + 1,
                value: column,
            })),
        );
    }, [columns]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = event => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            onChange({
                isComposedOf,
                fields: [...newItems.map(item => item.value)],
            });
        }
    };

    const handleSwitch = () => {
        onChange({
            isComposedOf: !isComposedOf,
            fields: !isComposedOf ? ['', ''] : [],
        });
    };

    const handleSelectColumn = index => column => {
        onChange({
            isComposedOf,
            fields: [
                ...columns.slice(0, index),
                column,
                ...columns.slice(index + 1),
            ],
        });
    };

    const handleAddColumn = () => {
        onChange({
            isComposedOf,
            fields: [...columns, ''],
        });
    };

    const handleRemoveColumn = index => () => {
        onChange({
            isComposedOf,
            fields: [...columns.slice(0, index), ...columns.slice(index + 1)],
        });
    };

    return (
        <div>
            <div style={styles.header}>{polyglot.t('wizard_composed_of')}</div>
            <div>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isComposedOf}
                            onChange={handleSwitch}
                        />
                    }
                    label={polyglot.t('is_composite_field')}
                />
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        {isComposedOf &&
                            items.map((item, index) => (
                                <ComposedOfColumn
                                    key={item.id}
                                    index={index}
                                    column={item.value}
                                    fields={fields}
                                    id={item.id}
                                    handleSelectColumn={handleSelectColumn(
                                        index,
                                    )}
                                    handleRemoveColumn={handleRemoveColumn(
                                        index,
                                    )}
                                />
                            ))}
                    </SortableContext>
                </DndContext>

                {isComposedOf && (
                    <Button
                        variant="text"
                        className="btn-add-composition-column"
                        onClick={handleAddColumn}
                    >
                        {polyglot.t('add_composition_column')}
                    </Button>
                )}
            </div>
        </div>
    );
};

FieldComposedOf.propTypes = {
    isComposedOf: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

FieldComposedOf.defaultProps = {
    isComposedOf: false,
    columns: [],
};

const mapStateToProps = (state, { FORM_NAME }) => {
    const composedOf = formValueSelector(FORM_NAME || FIELD_FORM_NAME)(
        state,
        'composedOf',
    );

    if (composedOf && composedOf.fields && composedOf.fields.length > 1) {
        return {
            isComposedOf: composedOf.isComposedOf,
            columns: composedOf.fields,
        };
    }

    return { isComposedOf: false, columns: [] };
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
