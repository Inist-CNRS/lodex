import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import copy from 'copy-to-clipboard';
import compose from 'lodash/flowRight';
import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React, { useEffect, useMemo, useRef, useState } from 'react';
// @ts-expect-error TS7016
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { connect } from 'react-redux';
import { useMeasure } from 'react-use';

import {
    FileCopy as FileCopyIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useDidUpdateEffect } from '../lib/useDidUpdateEffect';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromFields } from '../sharedSelectors';
import { NoField } from './NoField';

import { changePositions, loadField, saveFieldFromData } from '../fields';

import { useHistory, useLocation } from 'react-router';
import { SCOPE_DOCUMENT } from '../../../common/scope';
import { toast } from '../../../common/tools/toast';
import fieldApi from '../admin/api/field';
import { translate } from '../i18n/I18NContext';
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
        borderRadius: '3px',
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#444',
        '&:hover': {
            background: '#efefef',
            // display the duplicate icon and the settings icon
            '& .MuiIconButton-root, & .MuiSvgIcon-root, & .MuiCheckbox-root': {
                opacity: 1,
            },
        },
        padding: '8px',
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

// @ts-expect-error TS7006
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

// @ts-expect-error TS7006
const scrollToField = (fieldLabel) => {
    setTimeout(() => {
        const field = document.querySelector(`[aria-label="${fieldLabel}"]`);
        field?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    }, 200);
};

// @ts-expect-error TS7006
const layoutFromItems = (items) => {
    const result = items
        // @ts-expect-error TS7006
        .sort((a, b) => a.position - b.position)
        .reduce(
            // @ts-expect-error TS7006
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

// @ts-expect-error TS7006
const itemsFromLayout = (layout) =>
    layout
        // @ts-expect-error TS7006
        .sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y))
        // @ts-expect-error TS7006
        .map((item, index) => ({
            id: item.i,
            width: item.w,
            position: index + 1,
        }));

// @ts-expect-error TS2339
const FieldGridItem = connect((state, { field }) => ({
    // @ts-expect-error TS2339
    completedField: fromFields.getCompletedField(state, field),
}))(({
    field,
    completedField,
    polyglot,
    isFieldsLoading,
    isFieldSelected,
    handleToggleSelectedField,
    handleDuplicateField,
}) => {
    const rowCount = useMemo(() => {
        let rowCount = 2;
        if (completedField) {
            rowCount++;
        }
        // @ts-expect-error TS2339
        if (field.internalScopes || field.internalName) {
            rowCount++;
        }
        return rowCount;
    }, [field, completedField]);

    // @ts-expect-error TS7006
    const handleCopyToClipboard = (event, text) => {
        // Only copy to clipboard if the user clicks on the field name
        if (event.target.firstChild.nodeName !== '#text') {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        copy(text);
        // @ts-expect-error TS2339
        toast(polyglot.t('fieldidentifier_copied_clipboard'), {
            type: toast.TYPE.SUCCESS,
        });
    };

    return (
        <Box
            display="grid"
            gridTemplateColumns="1fr"
            gridTemplateRows={`repeat(${rowCount}, 1fr)`}
            alignItems="center"
            height="100%"
            width="100%"
        >
            <Stack direction="row" gap={1} alignItems="center">
                {/*
                 // @ts-expect-error TS2339 */}
                <Box onClick={(e) => handleCopyToClipboard(e, field.name)}>
                    <FieldRepresentation
                        field={field}
                        isFieldSelected={isFieldSelected}
                        handleToggleSelectedField={handleToggleSelectedField}
                        showNotAnnotableIcon
                    />
                </Box>
            </Stack>

            {completedField && (
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
                    <Tooltip
                        enterDelay={300}
                        placement="top"
                        arrow
                        // @ts-expect-error TS2339
                        title={polyglot.t('completes_field_X', {
                            // @ts-expect-error TS2339
                            field: completedField.label,
                        })}
                    >
                        <span>
                            {/*
                             // @ts-expect-error TS2339 */}
                            {polyglot.t('completes_field_X', {
                                // @ts-expect-error TS2339
                                field: completedField.label,
                            })}
                        </span>
                    </Tooltip>
                </Box>
            )}

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

                {/*
                 // @ts-expect-error TS2339 */}
                <Tooltip title={polyglot.t('duplicate_field_tooltip')}>
                    <IconButton
                        sx={styles.otherIcon}
                        onClick={handleDuplicateField}
                        // @ts-expect-error TS2339
                        aria-label={`duplicate-${field.label}`}
                        disabled={isFieldsLoading}
                        color="primary"
                        size="small"
                        disableRipple
                    >
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                {/*
                 // @ts-expect-error TS2339 */}
                <Tooltip title={polyglot.t('setting_field_tooltip')}>
                    <IconButton
                        sx={styles.otherIcon}
                        // @ts-expect-error TS2339
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
    );
});

// @ts-expect-error TS7006
export const buildFieldsDefinitionsArray = (fields) =>
    // @ts-expect-error TS7006
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
    // @ts-expect-error TS7031
    onChangeWidth,
    // @ts-expect-error TS7031
    onChangePositions,
    // @ts-expect-error TS7031
    allowResize,
    // @ts-expect-error TS7031
    fields,
    // @ts-expect-error TS7031
    polyglot,
    // @ts-expect-error TS7031
    loadField,
    // @ts-expect-error TS7031
    filter,
    // @ts-expect-error TS7031
    isFieldsLoading,
    // @ts-expect-error TS7031
    subresourceId,
    // @ts-expect-error TS7031
    selectedFields,
    // @ts-expect-error TS7031
    toggleSelectedField,
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
        // @ts-expect-error TS7006
    }, [JSON.stringify(items.map((item) => item.id))]);

    const stopClickPropagation = () => {
        setIsEditable(false);
        setTimeout(() => setIsEditable(true), 200);
    };

    // @ts-expect-error TS7006
    const handleLayoutChange = (newLayout) => {
        stopClickPropagation();
        setItems(itemsFromLayout(newLayout));
    };

    // @ts-expect-error TS7006
    const handleResize = (elements, el) => {
        stopClickPropagation();
        // @ts-expect-error TS7006
        const newEl = elements.find((elem) => elem.i === el.i);
        if (newEl) {
            onChangeWidth(newEl.i, newEl.w * 10);
            setItems(itemsFromLayout(elements));
        }
    };

    // @ts-expect-error TS7006
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

    // @ts-expect-error TS7006
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
        <Box sx={styles.layoutContainer} ref={gridLayoutRef} role="grid">
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
                {/*
                 // @ts-expect-error TS7006 */}
                {fields.map((field) => (
                    <Box
                        key={field.name}
                        role="gridcell"
                        aria-label={field.label}
                        sx={{
                            ...styles.property,
                            cursor: isFieldsLoading ? 'auto' : 'pointer',
                            borderStyle: field.display ? 'solid' : 'dashed',
                            borderColor: selectedFields.includes(field.name)
                                ? 'info.main'
                                : '#ccc',
                            opacity: field.display ? 1 : 0.7,
                        }}
                        onClick={() =>
                            handleEditField(field.name, filter, subresourceId)
                        }
                    >
                        <FieldGridItem
                            // @ts-expect-error TS2322
                            field={field}
                            // @ts-expect-error TS2322
                            polyglot={polyglot}
                            // @ts-expect-error TS2322
                            isFieldsLoading={isFieldsLoading}
                            // @ts-expect-error TS2322
                            isFieldSelected={selectedFields.includes(
                                field.name,
                            )}
                            // @ts-expect-error TS2322
                            handleToggleSelectedField={() =>
                                toggleSelectedField(field.name)
                            }
                            // @ts-expect-error TS2322
                            handleDuplicateField={(e) =>
                                handleDuplicateField(e, field)
                            }
                        />
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
    // @ts-expect-error TS7031
    fields,
    // @ts-expect-error TS7031
    filter,
    // @ts-expect-error TS7031
    loadField,
    // @ts-expect-error TS7031
    changePositions,
    // @ts-expect-error TS7031
    saveFieldFromData,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    isFieldsLoading,
    // @ts-expect-error TS7031
    subresourceId,
    // @ts-expect-error TS7031
    selectedFields,
    // @ts-expect-error TS7031
    toggleSelectedField,
}) => {
    const { pathname } = useLocation();

    const previousFieldsRef = useRef(fields);

    useEffect(() => {
        loadField();
    }, []);

    useEffect(() => {
        const previousFields = previousFieldsRef.current;

        const newFields = fields.filter(
            // @ts-expect-error TS7006
            (field) => !previousFields.find((f) => f.name === field.name),
        );

        if (newFields.length === 1) {
            scrollToField(newFields[0].label);
        }
        previousFieldsRef.current = fields;
    }, [fields]);

    // @ts-expect-error TS7006
    const handleChangePositions = (fieldsWithPosition) => {
        changePositions({
            type: filter,
            // @ts-expect-error TS7006
            fields: fieldsWithPosition.map((field) => ({
                name: field.id,
                position: field.position,
            })),
        });
    };

    // @ts-expect-error TS7006
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
                    selectedFields={selectedFields}
                    toggleSelectedField={toggleSelectedField}
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
    selectedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    toggleSelectedField: PropTypes.func.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { subresourceId, filter }) => ({
    // @ts-expect-error TS2339
    fields: fromFields.getEditingFields(state, { filter, subresourceId }),
    // @ts-expect-error TS2339
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
