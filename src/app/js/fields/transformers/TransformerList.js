import React, { useEffect, useState } from 'react';
import compose from 'recompose/compose';
import memoize from 'lodash.memoize';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import translate from 'redux-polyglot/translate';
import TransformerListItem from './TransformerListItem';
import TransformerUpsertDialog from './TransformerUpsertDialog';

import { Box, Button } from '@mui/material';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    DndContext,
    closestCenter,
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
import {
    getTransformerMetas,
    hasRegistredTransformer,
} from '../../../../common/transformers';

const SHOW_TRANSFORMER = memoize(
    (operation, type) =>
        !type ||
        !operation ||
        /**
         * We need to display the transformer in case it doesn't exist anymore
         * This way we can change it for legacy model imports
         */
        !hasRegistredTransformer(operation) ||
        getTransformerMetas(operation).type === type,
    (operation, type) => `${operation}_${type}`,
);

const TransformerList = ({
    fields,
    meta: { touched, error },
    type,
    hideFirstTransformers,
    p: polyglot,
}) => {
    const [fieldsToDrag, setFieldsToDrag] = useState(
        fields.map(fieldName => fieldName),
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [indexFieldToEdit, setIndexFieldToEdit] = useState(null);

    useEffect(() => {
        setFieldsToDrag(fields.map(fieldName => fieldName));
    }, [fields]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = event => {
        const { active, over } = event;
        let oldItemIndex;
        let newItemIndex;
        fields.map((fieldName, index) => {
            if (fieldName === active.id) {
                oldItemIndex = index;
            }
            if (fieldName === over.id) {
                newItemIndex = index;
            }
        });

        fields.move(oldItemIndex, newItemIndex);
        setFieldsToDrag(fieldsToDrag => {
            return arrayMove(fieldsToDrag, oldItemIndex, newItemIndex);
        });
    };
    return (
        <>
            {touched && error && <span>{error}</span>}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={fieldsToDrag}
                    strategy={verticalListSortingStrategy}
                >
                    {fieldsToDrag?.map((fieldName, index) => (
                        <TransformerListItem
                            key={fieldName}
                            id={fieldName}
                            transformer={fields.get(index)}
                            onRemove={() => {
                                fields.remove(index);
                            }}
                            onEdit={() => {
                                setIndexFieldToEdit(index);
                                setIsDialogOpen(true);
                            }}
                            show={
                                SHOW_TRANSFORMER(
                                    fields.get(index)?.operation,
                                    type,
                                ) &&
                                (!hideFirstTransformers ||
                                    index >= hideFirstTransformers)
                            }
                        />
                    ))}
                </SortableContext>
            </DndContext>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    aria-label={polyglot.t('add_transformer')}
                    color="primary"
                    sx={{ borderWidth: '2px', borderStyle: 'dashed' }}
                    onClick={() => {
                        setIndexFieldToEdit(null);
                        setIsDialogOpen(true);
                    }}
                >
                    {polyglot.t('add_transformer')}
                </Button>
            </Box>

            {isDialogOpen && (
                <TransformerUpsertDialog
                    isOpen={isDialogOpen}
                    handleClose={() => setIsDialogOpen(false)}
                    indexFieldToEdit={indexFieldToEdit}
                    fields={fields}
                    type={type}
                />
            )}
        </>
    );
};

TransformerList.propTypes = {
    hideFirstTransformers: PropTypes.number,
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
        get: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        move: PropTypes.func.isRequired,
        getAll: PropTypes.func.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
    }).isRequired,
    p: polyglotPropTypes.isRequired,
    type: PropTypes.string,
};

TransformerList.defaultProps = {
    type: null,
};

export default compose(translate, pure)(TransformerList);
