import React, { useEffect, useMemo, useState, useRef } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'lodash/flowRight';
import PropTypes from 'prop-types';
import GridLayout from 'react-grid-layout';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useMeasure } from 'react-use';
import 'react-grid-layout/css/styles.css';
import copy from 'copy-to-clipboard';

import {
    FileCopy as FileCopyIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { NoField } from './NoField';
import { useDidUpdateEffect } from '../lib/useDidUpdateEffect';
import { fromFields } from '../sharedSelectors';

import { loadField, changePositions, saveFieldFromData } from '../fields';

import fieldApi from '../admin/api/field';
import { toast } from '../../../common/tools/toast';
import { useLocation, useHistory } from 'react-router';
import { SCOPE_DOCUMENT } from '../../../common/scope';
import FieldRepresentation from './FieldRepresentation';

const ROOT_PADDING = 16;

const styles = {
    root: {
        padding: `${ROOT_PADDING}px}`,
        border: '1px dashed #ccc',
        borderRadius: '5px',
        overflow: 'hidden',
        display: 'flex',
        flexFlow: 'row wrap',
    },
    layoutContainer: {
        display: 'flex',
        flex: 1,
    },
    property: {
        borderWidth: '1px',
        borderColor: '#ccc',
        borderRadius: '3px',
        textAlign: 'center',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        position: 'relative',
        alignItems: 'center',
        color: '#444',
        '&:hover': {
            background: '#efefef',
            // display the duplicate icon and the settings icon
            '& .MuiIconButton-root, & .MuiSvgIcon-root': {
                opacity: 1,
            },
        },
        padding: '2px',
    },
    propertyHandle: {
        cursor: '-webkit-grab',
        margin: '0 5px',
        flex: 1,
        textAlign: 'left',
    },
    fieldChildren: {
        pointerEvents: 'none',
    },
    otherIcon: {
        opacity: 0,
    },
};

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

const scrollToField = (fieldLabel) => {
    setTimeout(() => {
        const field = document.querySelector(`[aria-label="${fieldLabel}"]`);
        field?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    }, 200);
};

const layoutFromItems = (items) => {
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

const itemsFromLayout = (layout) =>
    layout
        .sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y))
        .map((item, index) => ({
            id: item.i,
            width: item.w,
            position: index + 1,
        }));

const ItemGridLabel = connect((state, { field }) => ({
    completedField: fromFields.getCompletedField(state, field),
}))(({ field, onShowNameCopied, completedField, polyglot }) => {
    const handleCopyToClipboard = (event, text) => {
        event.stopPropagation();
        event.preventDefault();
        copy(text);
        onShowNameCopied();
    };

    const rowCount = useMemo(() => {
        let rowCount = 1;
        if (completedField) {
            rowCount++;
        }
        if (field.internalScopes || field.internalName) {
            rowCount++;
        }
        return rowCount;
    }, [field, completedField]);

    return (
        <Box
            onClick={(e) => {
                handleCopyToClipboard(e, field.name);
            }}
            display="grid"
            gridTemplateColumns="1fr"
            gridTemplateRows={`repeat(${rowCount}, 1fr)`}
            alignItems="center"
            height="100%"
            width="100%"
            maxWidth="min(100%, 300px)"
        >
            <FieldRepresentation field={field} />

            {completedField && (
                <Tooltip
                    enterDelay={300}
                    placement="top"
                    arrow
                    title={polyglot.t('completes_field_X', {
                        field: completedField.label,
                    })}
                >
                    <Box
                        sx={{
                            width: '100%',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textWrap: 'nowrap',
                            textAlign: 'left',
                        }}
                    >
                        {polyglot.t('completes_field_X', {
                            field: completedField.label,
                        })}
                    </Box>
                </Tooltip>
            )}
        </Box>
    );
});

export const buildFieldsDefinitionsArray = (fields) =>
    fields.map((field) => ({
        id: field.name,
        width: field.width ? parseInt(field.width, 10) / 10 : 10,
        position: field.position,
    }));

const DraggableItemGrid = compose(
    connect(null, {
        loadField,
    }),
)(({
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
    const history = useHistory();

    const [items, setItems] = useState(buildFieldsDefinitionsArray(fields));
    const [isEditable, setIsEditable] = useState(true);

    const layout = useMemo(
        () => layoutFromItems(items),
        [JSON.stringify(items)],
    );

    const [gridLayoutRef, { width }] = useMeasure();

    useEffect(() => {
        setItems(buildFieldsDefinitionsArray(fields));
    }, [JSON.stringify(fields)]);

    useDidUpdateEffect(() => {
        onChangePositions(items);
    }, [JSON.stringify(items.map((item) => item.id))]);

    const stopClickPropagation = () => {
        setIsEditable(false);
        setTimeout(() => setIsEditable(true), 200);
    };

    const handleLayoutChange = (newLayout) => {
        stopClickPropagation();
        setItems(itemsFromLayout(newLayout));
    };

    const handleResize = (elements, el) => {
        stopClickPropagation();
        const newEl = elements.find((elem) => elem.i === el.i);
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
        <Box sx={styles.layoutContainer} ref={gridLayoutRef}>
            <GridLayout
                className="layout"
                layout={layout}
                key={JSON.stringify(items)}
                cols={10}
                rowHeight={120}
                width={width - ROOT_PADDING}
                onDragStop={handleLayoutChange}
                onResizeStop={handleResize}
                isResizable={allowResize}
            >
                {fields.map((field) => (
                    <Box
                        key={field.name}
                        aria-label={field.label}
                        sx={{
                            ...styles.property,
                            cursor: isFieldsLoading ? 'auto' : 'pointer',
                            borderStyle: field.display ? 'solid' : 'dashed',
                            opacity: field.display ? 1 : 0.7,
                        }}
                        onClick={() =>
                            handleEditField(field.name, filter, subresourceId)
                        }
                    >
                        <ItemGridLabel
                            field={field}
                            polyglot={polyglot}
                            onShowNameCopied={() =>
                                toast(
                                    polyglot.t(
                                        'fieldidentifier_copied_clipboard',
                                    ),
                                    {
                                        type: toast.TYPE.SUCCESS,
                                    },
                                )
                            }
                        />

                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 0.25,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <IconButton color="primary" size="small">
                                <DragIndicatorIcon sx={styles.otherIcon} />
                            </IconButton>

                            <Tooltip
                                title={polyglot.t('duplicate_field_tooltip')}
                            >
                                <IconButton
                                    sx={styles.otherIcon}
                                    onClick={(e) => {
                                        handleDuplicateField(e, field);
                                    }}
                                    aria-label={`duplicate-${field.label}`}
                                    disabled={isFieldsLoading}
                                    color="primary"
                                    size="small"
                                >
                                    <FileCopyIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                title={polyglot.t('setting_field_tooltip')}
                            >
                                <IconButton
                                    sx={styles.otherIcon}
                                    aria-label={`edit-${field.label}`}
                                    disabled={isFieldsLoading}
                                    color="primary"
                                    size="small"
                                >
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                ))}
            </GridLayout>
        </Box>
    );
});

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
    const { pathname } = useLocation();

    const previousFieldsRef = useRef(fields);

    useEffect(() => {
        loadField();
    }, []);

    useEffect(() => {
        const previousFields = previousFieldsRef.current;

        const newFields = fields.filter(
            (field) => !previousFields.find((f) => f.name === field.name),
        );

        if (newFields.length === 1) {
            scrollToField(newFields[0].label);
        }
        previousFieldsRef.current = fields;
    }, [fields]);

    const handleChangePositions = (fieldsWithPosition) => {
        changePositions({
            type: filter,
            fields: fieldsWithPosition.map((field) => ({
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
        <Box sx={styles.root} className="field-grid">
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
        </Box>
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
