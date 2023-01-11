import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import HiddenIcon from '@material-ui/icons/VisibilityOff';
import translate from 'redux-polyglot/translate';
import compose from 'lodash.compose';
import PropTypes from 'prop-types';
import GridLayout from 'react-grid-layout';
import { Box, Button, makeStyles } from '@material-ui/core';
import { useMeasure } from 'react-use';
import 'react-grid-layout/css/styles.css';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';

import {
    OpenWith as DragIndicatorIcon,
    Settings as SettingsIcon,
    FileCopy as FileCopyIcon,
} from '@material-ui/icons';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { getShortText, isLongText } from '../lib/longTexts';
import { NoField } from './NoField';
import { useDidUpdateEffect } from '../lib/useDidUpdateEffect';
import { fromFields } from '../sharedSelectors';

import {
    loadField,
    editField,
    changePositions,
    saveFieldFromData,
} from '../fields';
import FieldInternalIcon from './FieldInternalIcon';

import fieldApi from '../admin/api/field';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router';

const ROOT_PADDING = 16;

const useStyles = makeStyles({
    root: {
        padding: ROOT_PADDING,
        border: '1px dashed #ccc',
        borderRadius: 5,
        overflow: 'hidden',
        display: 'flex',
        flexFlow: 'row wrap',
    },
    layoutContainer: {
        display: 'flex',
        flex: 1,
    },
    property: {
        border: '1px solid #ccc',
        cursor: disabled => (disabled ? 'auto' : 'pointer'),
        borderRadius: 3,
        textAlign: 'center',
        fontWeight: 'bold',
        display: 'flex',
        height: '100%',
        padding: '0 60px',
        justifyContent: 'center',
        position: 'relative',
        alignItems: 'center',
        color: '#444',
        '&:hover': {
            background: '#efefef',
        },
    },
    propertyHandle: {
        position: 'absolute',
        left: 20,
        cursor: 'pointer',
    },
    editIcon: {
        position: 'absolute',
        right: 20,
        minWidth: 30,
    },
    duplicateIcon: {
        position: 'absolute',
        right: 50,
        minWidth: 30,
    },
    propertyLabel: {
        marginRight: 10,
        cursor: 'copy',
    },
    actionsContainer: {
        marginLeft: 'auto',
        padding: '20px 10px 20px 0',
    },
    internal: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 'normal',
        alignItems: 'center',
    },
    fieldChildren: {
        pointerEvents: 'none',
    },
});

const ensureTextIsShort = text =>
    isLongText(text) ? getShortText(text) : text;

const layoutFromItems = items => {
    const result = items
        .sort((a, b) => a.position - b.position)
        .reduce(
            (acc, curr) => {
                if (acc.currXOffset + curr.width > 10) {
                    acc.currLine++;
                    acc.currXOffset = 0;
                }

                acc.layout.push({
                    i: curr.id,
                    x: acc.currXOffset,
                    y: curr.position + acc.currLine,
                    w: curr.width,
                    h: 1,
                    isBounded: true,
                });

                acc.currXOffset += curr.width;

                return acc;
            },
            { layout: [], currXOffset: 0, currLine: 0 },
        );

    return result.layout;
};

const itemsFromLayout = layout =>
    layout
        .sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y))
        .map((item, index) => ({
            id: item.i,
            width: item.w,
            position: index + 1,
        }));

const ItemGridLabel = connect((state, { field }) => ({
    completedField: fromFields.getCompletedField(state, field),
}))(({ field, completedField, polyglot, onShowNameCopied }) => {
    const classes = useStyles();

    const handleCopyToClipboard = (event, text) => {
        event.stopPropagation();
        event.preventDefault();
        copy(text);
        onShowNameCopied();
    };

    return (
        <>
            <Box
                onClick={e => {
                    handleCopyToClipboard(e, field.name);
                }}
            >
                <span>
                    {ensureTextIsShort(field.label)}
                    {` (${ensureTextIsShort(field.name)})`}
                    {completedField && (
                        <span>
                            {polyglot.t('completes_field_X', {
                                field: completedField.label,
                            })}
                        </span>
                    )}
                </span>
            </Box>
            <div className={classes.internal}>
                {field.internalScopes &&
                    field.internalScopes.map(internalScope => (
                        <FieldInternalIcon
                            key={internalScope}
                            scope={internalScope}
                        />
                    ))}
                {field.internalName}
            </div>
        </>
    );
});

export const buildFieldsDefinitionsArray = fields =>
    fields.map(field => ({
        id: field.name,
        width: field.width ? parseInt(field.width, 10) / 10 : 10,
        position: field.position,
    }));

const DraggableItemGrid = compose(
    connect(null, {
        loadField,
    }),
)(
    ({
        onEditField,
        onChangeWidth,
        onChangePositions,
        allowResize,
        fields,
        polyglot,
        loadField,
        filter,
        isFieldsLoading,
    }) => {
        const classes = useStyles(isFieldsLoading);

        const [items, setItems] = useState(buildFieldsDefinitionsArray(fields));
        const [isEditable, setIsEditable] = useState(true);

        const layout = useMemo(() => layoutFromItems(items), [
            JSON.stringify(items),
        ]);

        const [gridLayoutRef, { width }] = useMeasure();

        useEffect(() => {
            setItems(buildFieldsDefinitionsArray(fields));
        }, [JSON.stringify(fields)]);

        useDidUpdateEffect(() => {
            onChangePositions(items);
        }, [JSON.stringify(items.map(item => item.id))]);

        const stopClickPropagation = () => {
            setIsEditable(false);
            setTimeout(() => setIsEditable(true), 200);
        };

        const handleLayoutChange = newLayout => {
            stopClickPropagation();
            setItems(itemsFromLayout(newLayout));
        };

        const handleResize = (elements, el) => {
            stopClickPropagation();
            const newEl = elements.find(elem => elem.i === el.i);
            if (newEl) {
                onChangeWidth(newEl.i, newEl.w * 10);
                setItems(itemsFromLayout(elements));
            }
        };

        const handleEditField = (field, filter) => {
            if (isEditable && !isFieldsLoading) {
                onEditField({ field, filter });
            }
        };

        const handleDuplicateField = async (event, field) => {
            event.stopPropagation();
            event.preventDefault();

            const res = await fieldApi.duplicateField({
                fieldId: field._id,
            });

            if (!res) {
                toast(`${polyglot.t('duplicate_field_error')}`, {
                    type: toast.TYPE.ERROR,
                });
            }

            loadField();
            toast(`${polyglot.t('duplicate_field_success')}`, {
                type: toast.TYPE.SUCCESS,
            });
        };

        return (
            <div className={classes.layoutContainer} ref={gridLayoutRef}>
                <GridLayout
                    className="layout"
                    layout={layout}
                    key={JSON.stringify(items)}
                    cols={10}
                    rowHeight={150}
                    width={width - ROOT_PADDING}
                    onDragStop={handleLayoutChange}
                    onResizeStop={handleResize}
                    isResizable={allowResize}
                >
                    {fields.map(field => (
                        <div
                            key={field.name}
                            aria-label={field.label}
                            className={classes.property}
                            onClick={() => handleEditField(field.name, filter)}
                        >
                            <span
                                className={classNames(
                                    'draghandle',
                                    classes.propertyHandle,
                                    classes.fieldChildren,
                                )}
                            >
                                <DragIndicatorIcon />
                            </span>
                            <span
                                className={classNames(classes.propertyLabel)}
                                data-field-name={field.name}
                            >
                                <ItemGridLabel
                                    field={field}
                                    polyglot={polyglot}
                                    onShowNameCopied={() =>
                                        toast(
                                            polyglot.t(
                                                'fieldname_copied_clipboard',
                                            ),
                                            {
                                                type: toast.TYPE.SUCCESS,
                                            },
                                        )
                                    }
                                />
                            </span>
                            <Button
                                className={classNames(classes.duplicateIcon)}
                                onClick={e => {
                                    handleDuplicateField(e, field);
                                }}
                                aria-label={`duplicate-${field.label}`}
                                disabled={isFieldsLoading}
                            >
                                <FileCopyIcon />
                            </Button>
                            <Button
                                className={classNames(
                                    classes.editIcon,
                                    classes.fieldChildren,
                                )}
                                aria-label={`edit-${field.label}`}
                                disabled={isFieldsLoading}
                            >
                                <SettingsIcon />
                            </Button>
                            {!field.display && <HiddenIcon />}
                        </div>
                    ))}
                </GridLayout>
            </div>
        );
    },
);

DraggableItemGrid.propTypes = {
    onEditField: PropTypes.func.isRequired,
    onChangeWidth: PropTypes.func.isRequired,
    onChangePositions: PropTypes.func.isRequired,
    allowResize: PropTypes.bool,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            width: PropTypes.string,
            position: PropTypes.number,
            display: PropTypes.bool,
            internalScopes: PropTypes.string,
            internalName: PropTypes.string,
        }),
    ).isRequired,
    polyglot: PropTypes.object.isRequired,
    loadField: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    isFieldsLoading: PropTypes.bool,
};

const FieldGridComponent = ({
    fields,
    filter,
    loadField,
    editField,
    changePositions,
    saveFieldFromData,
    p: polyglot,
    isFieldsLoading,
}) => {
    const classes = useStyles();

    const { pathname } = useLocation();

    useEffect(() => {
        loadField();
    }, []);

    const handleChangePositions = fieldsWithPosition => {
        changePositions({
            type: filter,
            fields: fieldsWithPosition.map(field => ({
                name: field.id,
                position: field.position,
            })),
        });
    };

    const handleChangeWidth = (name, width) => {
        saveFieldFromData({
            name,
            data: { width },
            silent: true /* Doesn't trigger "success" / re-publish */,
        });
    };

    return (
        <div className={classNames(classes.root, 'field-grid')}>
            {fields.length === 0 ? (
                <NoField
                    label={polyglot.t(
                        pathname.includes('/document/main')
                            ? 'no_field_add_resource'
                            : 'no_field_add',
                    )}
                />
            ) : (
                <DraggableItemGrid
                    key={filter}
                    fields={fields}
                    onEditField={editField}
                    onChangeWidth={handleChangeWidth}
                    onChangePositions={handleChangePositions}
                    allowResize={true}
                    polyglot={polyglot}
                    filter={filter}
                    isFieldsLoading={isFieldsLoading}
                />
            )}
        </div>
    );
};

FieldGridComponent.propTypes = {
    fields: PropTypes.array,
    filter: PropTypes.string,
    loadField: PropTypes.func.isRequired,
    editField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    changePositions: PropTypes.func.isRequired,
    saveFieldFromData: PropTypes.func.isRequired,
    isFieldsLoading: PropTypes.bool,
};

const mapStateToProps = (state, { subresourceId, filter }) => ({
    fields: fromFields.getEditingFields(state, { filter, subresourceId }),
    isFieldsLoading: fromFields.isLoading(state),
});

export const FieldGrid = compose(
    translate,
    connect(mapStateToProps, {
        loadField,
        editField,
        changePositions,
        saveFieldFromData,
    }),
)(FieldGridComponent);
