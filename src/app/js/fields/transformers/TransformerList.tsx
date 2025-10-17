import { useEffect, useState } from 'react';
import memoize from 'lodash/memoize';
import pure from 'recompose/pure';
import { useTranslate } from '../../i18n/I18NContext';
import TransformerListItem from './TransformerListItem';
import TransformerUpsertDialog from './TransformerUpsertDialog';

import { Box, Button, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
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
import { getTransformerMetas, hasRegistredTransformer } from '@lodex/common';
import TransformerRemoveAllDialog from './TransformerRemoveAllDialog';
import { GET_SOURCE_VALUE_FROM_TRANSFORMERS } from '../sourceValue/SourceValueToggle';
import type { UseFieldArrayReturn } from 'react-hook-form';
import type { Transformer } from '../types.ts';

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

// @ts-expect-error TS7006
const getHiddenTransformers = (source) => {
    if (source === 'fromSubresource') {
        return 7;
    }
    if (source === 'fromColumnsForSubRessource') {
        return 3;
    }
    if (source === 'fromColumns' || source === 'arbitrary') {
        return 1;
    }
    if (source === 'routine') {
        return 2;
    }
    return 0;
};

export const TransformerListComponent = ({
    fields,
    append,
    update,
    move,
    remove,
    replace,
    isSubresourceField,
    type = null,
}: {
    fields: Transformer[];
    append: UseFieldArrayReturn['append'];
    update: UseFieldArrayReturn['update'];
    move: UseFieldArrayReturn['move'];
    remove: UseFieldArrayReturn['remove'];
    replace: UseFieldArrayReturn['replace'];
    isSubresourceField?: boolean;
    type?: string | null;
}) => {
    const { translate } = useTranslate();
    const [fieldsToDrag, setFieldsToDrag] = useState(
        fields.map((field) => field.id),
    );

    const { source, value } = GET_SOURCE_VALUE_FROM_TRANSFORMERS(
        fields as unknown[] as Transformer[],
        isSubresourceField,
    );

    const hideFirstTransformers = getHiddenTransformers(source);

    const transformersLocked = source === 'fromSubresource' && !value;

    const [isTransformerUpsertDialogOpen, setIsTransformerUpsertDialogOpen] =
        useState(false);
    const [isRemoveAllDialogOpen, setIsRemoveAllDialogOpen] = useState(false);
    const [indexFieldToEdit, setIndexFieldToEdit] = useState<number | null>(
        null,
    );

    useEffect(() => {
        setFieldsToDrag(fields.map((field) => field.id));
    }, [fields]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    // @ts-expect-error TS7006
    const handleDragEnd = (event) => {
        const { active, over } = event;
        let oldItemIndex: number | undefined = undefined;
        let newItemIndex: number | undefined = undefined;
        fields.forEach((field, index) => {
            if (field.id === active.id) {
                oldItemIndex = index;
            }
            if (field.id === over.id) {
                newItemIndex = index;
            }
        });

        if (!oldItemIndex || !newItemIndex) {
            return;
        }

        move(oldItemIndex, newItemIndex);
        setFieldsToDrag((fieldsToDrag) => {
            return arrayMove(fieldsToDrag, oldItemIndex!, newItemIndex!);
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
                        {translate('transformers')}
                    </Typography>
                </Box>
                {!transformersLocked && (
                    <Button
                        variant="text"
                        color="warning"
                        disabled={fieldsToDrag?.length <= hideFirstTransformers}
                        onClick={() => setIsRemoveAllDialogOpen(true)}
                        startIcon={<DeleteIcon />}
                    >
                        {translate('delete_all')}
                    </Button>
                )}
            </Box>
            {transformersLocked ? (
                translate('transformer_no_editable_with_subresource_uid_value')
            ) : (
                <>
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
                                    transformer={fields[index]}
                                    onRemove={() => remove(index)}
                                    onEdit={() => {
                                        setIndexFieldToEdit(index);
                                        setIsTransformerUpsertDialogOpen(true);
                                    }}
                                    show={
                                        SHOW_TRANSFORMER(
                                            fields[index]?.operation,
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
                            aria-label={translate('add_transformer')}
                            color="primary"
                            sx={{ borderWidth: '2px', borderStyle: 'dashed' }}
                            onClick={() => {
                                setIndexFieldToEdit(null);
                                setIsTransformerUpsertDialogOpen(true);
                            }}
                        >
                            {translate('add_transformer')}
                        </Button>
                    </Box>

                    {isTransformerUpsertDialogOpen && (
                        <TransformerUpsertDialog
                            // @ts-expect-error TS2322
                            isOpen={isTransformerUpsertDialogOpen}
                            handleClose={() =>
                                setIsTransformerUpsertDialogOpen(false)
                            }
                            indexFieldToEdit={indexFieldToEdit}
                            append={append}
                            update={update}
                            fields={fields}
                            type={type}
                        />
                    )}
                    {isRemoveAllDialogOpen && (
                        <TransformerRemoveAllDialog
                            isOpen={isRemoveAllDialogOpen}
                            handleClose={() => setIsRemoveAllDialogOpen(false)}
                            removeAll={() =>
                                replace(
                                    fields.toSpliced(
                                        hideFirstTransformers,
                                        fields.length - hideFirstTransformers,
                                    ),
                                )
                            }
                        />
                    )}
                </>
            )}
        </Box>
    );
};

export default pure(TransformerListComponent);
