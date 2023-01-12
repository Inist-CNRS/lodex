import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import pure from 'recompose/pure';
import { ListSubheader, Button } from '@material-ui/core';
import memoize from 'lodash.memoize';

import { polyglot as polyglotPropTypes } from '../propTypes';
import TransformerListItem from './TransformerListItem';

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
} from '../../../common/transformers';

const styles = {
    header: {
        fontSize: '16px',
        paddingLeft: 0,
    },
};

const showTransformer = memoize(
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
        <div>
            <ListSubheader style={styles.header}>
                {polyglot.t('transformers')}
            </ListSubheader>
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
                            fieldName={fieldName}
                            onRemove={() => {
                                fields.remove(index);
                            }}
                            operation={fields.get(index)?.operation}
                            type={type}
                            show={
                                showTransformer(
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

            <div style={{ textAlign: 'center' }}>
                <Button
                    variant="text"
                    className="add-transformer"
                    onClick={() => fields.push({})}
                >
                    {polyglot.t('add_transformer')}
                </Button>
            </div>
        </div>
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
