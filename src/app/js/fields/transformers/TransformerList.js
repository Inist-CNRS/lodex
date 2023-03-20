import React, { useEffect, useState } from 'react';
import compose from 'recompose/compose';
import memoize from 'lodash.memoize';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import translate from 'redux-polyglot/translate';
import TransformerListItem from './TransformerListItem';
import TransformerUpsertDialog from './TransformerUpsertDialog';

import isEqual from 'lodash.isequal';

import { Box, Button, Tooltip, Typography } from '@mui/material';
import { Delete as DeleteIcon, SaveAs } from '@mui/icons-material';
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
import TransformerRemoveAllDialog from './TransformerRemoveAllDialog';
import { GET_SOURCE_VALUE_FROM_TRANSFORMERS } from '../sourceValue/SourceValueToggle';

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

const getHiddenTransformers = source => {
    if (source === 'fromSubresource') {
        return 7;
    }
    if (source === 'fromColumnsForSubRessource') {
        return 3;
    }
    if (source === 'fromColumns' || source === 'arbitrary') {
        return 1;
    }
    return 0;
};

export const TransformerListComponent = ({
    fields,
    meta: { touched, error },
    type,
    isSubresourceField,
    p: polyglot,
    currentEditedField,
}) => {
    const [fieldsToDrag, setFieldsToDrag] = useState(
        fields.map(fieldName => fieldName),
    );

    const isTransformersModified = !isEqual(
        fields.getAll(),
        currentEditedField.transformers,
    );

    const { source, value } = GET_SOURCE_VALUE_FROM_TRANSFORMERS(
        fields.getAll(),
        isSubresourceField,
    );

    const hideFirstTransformers = getHiddenTransformers(source);

    const transformersLocked = source === 'fromSubresource' && !value;

    const [
        isTransformerUpsertDialogOpen,
        setIsTransformerUpsertDialogOpen,
    ] = useState(false);
    const [isRemoveAllDialogOpen, setIsRemoveAllDialogOpen] = useState(false);
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
        <Box pt={5}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1">
                        {polyglot.t('transformers')}
                    </Typography>
                    {isTransformersModified && (
                        <Tooltip
                            title={polyglot.t('transformers_is_modified')}
                            sx={{ marginLeft: 1 }}
                        >
                            <SaveAs fontSize="small" />
                        </Tooltip>
                    )}
                </Box>
                {!transformersLocked && (
                    <Button
                        variant="text"
                        color="warning"
                        disabled={fieldsToDrag?.length <= hideFirstTransformers}
                        onClick={() => setIsRemoveAllDialogOpen(true)}
                        startIcon={<DeleteIcon />}
                    >
                        {polyglot.t('delete_all')}
                    </Button>
                )}
            </Box>
            {transformersLocked ? (
                polyglot.t('transformer_no_editable_with_subresource_uid_value')
            ) : (
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
                                        setIsTransformerUpsertDialogOpen(true);
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
                                setIsTransformerUpsertDialogOpen(true);
                            }}
                        >
                            {polyglot.t('add_transformer')}
                        </Button>
                    </Box>

                    {isTransformerUpsertDialogOpen && (
                        <TransformerUpsertDialog
                            isOpen={isTransformerUpsertDialogOpen}
                            handleClose={() =>
                                setIsTransformerUpsertDialogOpen(false)
                            }
                            indexFieldToEdit={indexFieldToEdit}
                            fields={fields}
                            type={type}
                        />
                    )}
                    {isRemoveAllDialogOpen && (
                        <TransformerRemoveAllDialog
                            isOpen={isRemoveAllDialogOpen}
                            handleClose={() => setIsRemoveAllDialogOpen(false)}
                            removeAll={() =>
                                fields.splice(
                                    hideFirstTransformers,
                                    fields.length - hideFirstTransformers,
                                )
                            }
                        />
                    )}
                </>
            )}
        </Box>
    );
};

TransformerListComponent.propTypes = {
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
        get: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        move: PropTypes.func.isRequired,
        getAll: PropTypes.func.isRequired,
        splice: PropTypes.func.isRequired,
        length: PropTypes.number.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
    }).isRequired,
    p: polyglotPropTypes.isRequired,
    type: PropTypes.string,
    isSubresourceField: PropTypes.bool,
    currentEditedField: PropTypes.object,
};

TransformerListComponent.defaultProps = {
    type: null,
};

export default compose(translate, pure)(TransformerListComponent);
