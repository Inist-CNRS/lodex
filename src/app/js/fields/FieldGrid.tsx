import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import copy from 'copy-to-clipboard';
import compose from 'lodash/flowRight';
import { useEffect, useMemo, useRef, useState } from 'react';
import GridLayout from 'react-grid-layout';
// @ts-expect-error TS7016
import 'react-grid-layout/css/styles.css';
import { connect } from 'react-redux';
import { useMeasure } from 'react-use';

import {
    FileCopy as FileCopyIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useDidUpdateEffect } from '../lib/useDidUpdateEffect';
import { fromFields } from '../sharedSelectors';
import { NoField } from './NoField';

import { changePositions, loadField, saveFieldFromData } from '../fields';

import { useHistory, useLocation } from 'react-router';
import { SCOPE_DOCUMENT } from '../../../common/scope';
import { toast } from '../../../common/tools/toast';
import fieldApi from '../admin/api/field';
import FieldRepresentation from './FieldRepresentation';
import { useTranslate } from '../i18n/I18NContext';
import type { State } from '../admin/reducers';

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

type FieldGridItemProps = {
    field: {
        name: string;
        label: string;
        _id: string;
    };
    completedField?: {
        name: string;
        label: string;
    };
    isFieldsLoading?: boolean;
    isFieldSelected: boolean;
    handleToggleSelectedField(...args: unknown[]): unknown;
    handleDuplicateField(...args: unknown[]): unknown;
};

const FieldGridItem = connect(
    (
        state: State,
        {
            field,
        }: {
            field: { name: string; label: string; _id: string };
        },
    ) => ({
        completedField: fromFields.getCompletedField(state, field),
    }),
)(({
    field,
    completedField,
    isFieldsLoading,
    isFieldSelected,
    handleToggleSelectedField,
    handleDuplicateField,
}: FieldGridItemProps) => {
    const { translate } = useTranslate();
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
        toast(translate('fieldidentifier_copied_clipboard'), {
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
                        title={translate('completes_field_X', {
                            field: completedField.label,
                        })}
                    >
                        <span>
                            {translate('completes_field_X', {
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

                <Tooltip title={translate('duplicate_field_tooltip')}>
                    <IconButton
                        sx={styles.otherIcon}
                        onClick={handleDuplicateField}
                        aria-label={`duplicate-${field.label}`}
                        disabled={isFieldsLoading}
                        color="primary"
                        size="small"
                        disableRipple
                    >
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={translate('setting_field_tooltip')}>
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

interface DraggableItemGridProps {
    onEditField?(...args: unknown[]): unknown;
    onChangeWidth(...args: unknown[]): unknown;
    onChangePositions(...args: unknown[]): unknown;
    allowResize?: boolean;
    fields: {
        name: string;
        label: string;
        width?: string;
        position?: number;
        display?: boolean;
        internalScopes?: string;
        internalName?: string;
    }[];
    polyglot: object;
    loadField(): void;
    filter: string;
    isFieldsLoading?: boolean;
    subresourceId?: string;
    selectedFields: string[];
    toggleSelectedField(...args: unknown[]): unknown;
}

const DraggableItemGrid = compose(
    connect(null, {
        loadField,
    }),
)(({
    onChangeWidth,
    onChangePositions,
    allowResize,
    fields,
    loadField,
    filter,
    isFieldsLoading,
    subresourceId,
    selectedFields,
    toggleSelectedField,
}: DraggableItemGridProps) => {
    const { translate } = useTranslate();
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
            toast(`${translate('duplicate_field_error')}`, {
                type: toast.TYPE.ERROR,
            });
        }

        loadField();
        toast(`${translate('duplicate_field_success')}`, {
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
                            isFieldsLoading={isFieldsLoading}
                            isFieldSelected={selectedFields.includes(
                                field.name,
                            )}
                            handleToggleSelectedField={() =>
                                toggleSelectedField(field.name)
                            }
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

interface FieldGridComponentProps {
    fields: {
        name: string;
        label: string;
    }[];
    filter?: string;
    loadField(...args: unknown[]): unknown;
    changePositions(...args: unknown[]): unknown;
    saveFieldFromData(...args: unknown[]): unknown;
    isFieldsLoading?: boolean;
    subresourceId?: string;
    selectedFields: string[];
    toggleSelectedField(...args: unknown[]): unknown;
}

const FieldGridComponent = ({
    fields,
    filter,
    loadField,
    changePositions,
    saveFieldFromData,
    isFieldsLoading,
    subresourceId,
    selectedFields,
    toggleSelectedField,
}: FieldGridComponentProps) => {
    const { translate } = useTranslate();
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
                    label={translate(
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

// @ts-expect-error TS7006
const mapStateToProps = (state, { subresourceId, filter }) => ({
    fields: fromFields.getEditingFields(state, { filter, subresourceId }),
    isFieldsLoading: fromFields.isLoading(state),
});

export const FieldGrid = compose(
    connect(mapStateToProps, {
        loadField,
        changePositions,
        saveFieldFromData,
    }),
)(FieldGridComponent);
