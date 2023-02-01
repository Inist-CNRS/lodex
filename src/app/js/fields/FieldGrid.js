import React, { useEffect, useMemo, useState, useRef } from 'react';
import { connect } from 'react-redux';
import HiddenIcon from '@material-ui/icons/VisibilityOff';
import translate from 'redux-polyglot/translate';
import compose from 'lodash.compose';
import PropTypes from 'prop-types';
import GridLayout from 'react-grid-layout';
import { Box, makeStyles } from '@material-ui/core';
import { useMeasure } from 'react-use';
import 'react-grid-layout/css/styles.css';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';

import {
    FileCopy as FileCopyIcon,
    Settings as SettingsIcon,
} from '@material-ui/icons';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { getShortText, isLongText } from '../lib/longTexts';
import { NoField } from './NoField';
import { useDidUpdateEffect } from '../lib/useDidUpdateEffect';
import { fromFields } from '../sharedSelectors';

import { loadField, changePositions, saveFieldFromData } from '../fields';
import FieldInternalIcon from './FieldInternalIcon';

import fieldApi from '../admin/api/field';
import { toast } from 'react-toastify';
import { useLocation, useHistory } from 'react-router';
import { IconButton, Tooltip } from '@mui/material';
import { SCOPE_DOCUMENT } from '../../../common/scope';

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
        justifyContent: 'space-between',
        position: 'relative',
        alignItems: 'center',
        color: '#444',
        '&:hover': {
            background: '#efefef',
            // display the duplicate icon and the settings icon
            '& $otherIcon': {
                opacity: 1,
            },
        },
    },
    propertyHandle: {
        cursor: '-webkit-grab',
        margin: '0 5px',
        flex: 1,
        textAlign: 'left',
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
    otherIcon: {
        opacity: 0,
    },
});

export const getEditFieldRedirectUrl = (fieldName, scope, subresourceId) => {
    if (scope === SCOPE_DOCUMENT) {
        if (subresourceId) {
            return `/display/${SCOPE_DOCUMENT}/subresource/${subresourceId}/edit/${fieldName}`;
        } else {
            return `/display/${SCOPE_DOCUMENT}/main/edit/${fieldName}`;
        }
    } else {
        return `/display/${scope}/edit/${fieldName}`;
    }
};

const scrollToField = fieldLabel => {
    setTimeout(() => {
        const field = document.querySelector(`[aria-label="${fieldLabel}"]`);
        field?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    }, 200);
};

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
        onChangeWidth,
        onChangePositions,
        allowResize,
        fields,
        polyglot,
        loadField,
        filter,
        isFieldsLoading,
        subresourceId,
    }) => {
        const classes = useStyles(isFieldsLoading);
        const history = useHistory();

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

        const handleEditField = (fieldName, filter, subresourceId) => {
            if (isEditable && !isFieldsLoading) {
                const redirectUrl = getEditFieldRedirectUrl(
                    fieldName,
                    filter,
                    subresourceId,
                );
                history.push(redirectUrl);
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
                    rowHeight={75}
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
                            onClick={() =>
                                handleEditField(
                                    field.name,
                                    filter,
                                    subresourceId,
                                )
                            }
                        >
                            <div
                                className={classNames(
                                    'draghandle',
                                    classes.propertyHandle,
                                    classes.fieldChildren,
                                )}
                            >
                                <DragIndicatorIcon />
                            </div>
                            <div
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
                            </div>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    marginRight: 10,
                                    flex: 1,
                                }}
                            >
                                <Tooltip
                                    title={polyglot.t(
                                        'duplicate_field_tooltip',
                                    )}
                                >
                                    <Box>
                                        <IconButton
                                            className={classNames(
                                                classes.otherIcon,
                                            )}
                                            onClick={e => {
                                                handleDuplicateField(e, field);
                                            }}
                                            aria-label={`duplicate-${field.label}`}
                                            disabled={isFieldsLoading}
                                        >
                                            <FileCopyIcon />
                                        </IconButton>
                                    </Box>
                                </Tooltip>
                                <Tooltip
                                    title={polyglot.t('setting_field_tooltip')}
                                >
                                    <Box>
                                        <IconButton
                                            className={classNames(
                                                classes.otherIcon,
                                            )}
                                            aria-label={`edit-${field.label}`}
                                            disabled={isFieldsLoading}
                                        >
                                            <SettingsIcon />
                                        </IconButton>
                                    </Box>
                                </Tooltip>
                                {!field.display && <HiddenIcon />}
                            </Box>
                        </div>
                    ))}
                </GridLayout>
            </div>
        );
    },
);

DraggableItemGrid.propTypes = {
    onEditField: PropTypes.func,
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
    loadField: PropTypes.func,
    filter: PropTypes.string.isRequired,
    isFieldsLoading: PropTypes.bool,
    subresourceId: PropTypes.string,
};

const FieldGridComponent = ({
    fields,
    filter,
    loadField,
    changePositions,
    saveFieldFromData,
    p: polyglot,
    isFieldsLoading,
    subresourceId,
}) => {
    const classes = useStyles();

    const { pathname } = useLocation();

    const previousFieldsRef = useRef(fields);

    useEffect(() => {
        loadField();
    }, []);

    useEffect(() => {
        const previousFields = previousFieldsRef.current;

        const newFields = fields.filter(
            field => !previousFields.find(f => f.name === field.name),
        );

        if (newFields.length === 1) {
            scrollToField(newFields[0].label);
        }
        previousFieldsRef.current = fields;
    }, [fields]);

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
                    onChangeWidth={handleChangeWidth}
                    onChangePositions={handleChangePositions}
                    allowResize={true}
                    polyglot={polyglot}
                    filter={filter}
                    isFieldsLoading={isFieldsLoading}
                    subresourceId={subresourceId}
                />
            )}
        </div>
    );
};

FieldGridComponent.propTypes = {
    fields: PropTypes.array,
    filter: PropTypes.string,
    loadField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    changePositions: PropTypes.func.isRequired,
    saveFieldFromData: PropTypes.func.isRequired,
    isFieldsLoading: PropTypes.bool,
    subresourceId: PropTypes.string,
};

const mapStateToProps = (state, { subresourceId, filter }) => ({
    fields: fromFields.getEditingFields(state, { filter, subresourceId }),
    isFieldsLoading: fromFields.isLoading(state),
});

export const FieldGrid = compose(
    translate,
    connect(mapStateToProps, {
        loadField,
        changePositions,
        saveFieldFromData,
    }),
)(FieldGridComponent);
