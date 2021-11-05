import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import HiddenIcon from '@material-ui/icons/VisibilityOff';
import translate from 'redux-polyglot/translate';
import compose from 'lodash.compose';
import PropTypes from 'prop-types';
import GridLayout from 'react-grid-layout';
import { Button, makeStyles, Snackbar } from '@material-ui/core';
import 'react-grid-layout/css/styles.css';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Alert from '@material-ui/lab/Alert';

import {
    OpenWith as DragIndicatorIcon,
    Settings as SettingsIcon,
} from '@material-ui/icons';

import { polyglot as polyglotPropTypes } from '../propTypes';
import PublicationModalWizard from '../fields/wizard';
import { getShortText, isLongText } from '../lib/longTexts';
import { SCOPE_GRAPHIC } from '../../../common/scope';
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

const useStyles = makeStyles({
    root: {
        padding: '1rem',
        border: '1px dashed #ccc',
        borderRadius: 5,
        overflow: 'hidden',
        display: 'flex',
        flexFlow: 'row wrap',
    },
    property: {
        border: '1px solid #ccc',
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
            position: index,
            width: item.w,
            _x: item.x, // will trigger refresh if in the same line
        }));

const ItemGridLabel = connect((state, { field }) => ({
    completedField: fromFields.getCompletedField(state, field),
}))(({ field, completedField, polyglot, onShowNameCopied }) => {
    const classes = useStyles();
    return (
        <>
            <CopyToClipboard text={field.name} onCopy={onShowNameCopied}>
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
            </CopyToClipboard>
            <div className={classes.internal}>
                {field.internalState && (
                    <FieldInternalIcon state={field.internalState} />
                )}
                {field.internalName}
            </div>
        </>
    );
});

export const buildFieldsDefinitionsArray = fields =>
    fields.map(field => ({
        id: field.name,
        width: !!field.width ? parseInt(field.width, 10) / 10 : 10,
        position: field.position,
    }));

const DraggableItemGrid = ({
    onEditField,
    onChangeWidth,
    onChangePositions,
    allowResize,
    fields,
    polyglot,
}) => {
    const [showNameCopied, setShowNameCopied] = useState(false);
    const classes = useStyles();

    const [items, setItems] = useState(buildFieldsDefinitionsArray(fields));

    const layout = useMemo(() => layoutFromItems(items), [items]);

    useDidUpdateEffect(() => {
        onChangePositions(items);
    }, [JSON.stringify(items.map(item => item.id))]);

    const handleLayoutChange = newLayout => {
        setItems(itemsFromLayout(newLayout));
    };

    const handleResize = (elements, el) => {
        const newEl = elements.find(elem => elem.i === el.i);
        if (newEl) {
            onChangeWidth(newEl.i, newEl.w * 10);
            setItems(itemsFromLayout(elements));
        }
    };

    return (
        <>
            <GridLayout
                className="layout"
                layout={layout}
                key={JSON.stringify(items)}
                cols={10}
                rowHeight={150}
                width={1000}
                draggableHandle=".draghandle"
                onDragStop={handleLayoutChange}
                onResizeStop={handleResize}
                isResizable={allowResize}
            >
                {fields.map(field => (
                    <div key={field.name} className={classes.property}>
                        <span
                            className={classNames(
                                'draghandle',
                                classes.propertyHandle,
                            )}
                        >
                            <DragIndicatorIcon />
                        </span>
                        <span
                            className={classes.propertyLabel}
                            data-field-name={field.name}
                        >
                            <ItemGridLabel
                                field={field}
                                polyglot={polyglot}
                                onShowNameCopied={() => setShowNameCopied(true)}
                            />
                        </span>
                        <Button
                            className={classes.editIcon}
                            onClick={() => onEditField(field.name)}
                        >
                            <SettingsIcon />
                        </Button>
                        {!field.display && <HiddenIcon />}
                    </div>
                ))}
            </GridLayout>
            <Snackbar
                open={showNameCopied}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={() => setShowNameCopied(false)}
            >
                <Alert variant="filled" severity="success">
                    {polyglot.t('fieldname_copied_clipboard')}
                </Alert>
            </Snackbar>
        </>
    );
};

const FieldGridComponent = ({
    fields,
    filter,
    editField,
    changePositions,
    saveFieldFromData,
    p: polyglot,
    isSubresource,
    addFieldButton,
}) => {
    const classes = useStyles();

    useEffect(() => {
        loadField();
    }, []);

    const handleExitEdition = e => {
        e.preventDefault();
        e.stopPropagation();
        editField(null);
    };

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
        <div className={classes.root}>
            {fields.length === 0 ? (
                <NoField label={polyglot.t('no_field_add')} />
            ) : (
                <DraggableItemGrid
                    key={filter}
                    fields={fields}
                    onEditField={editField}
                    onChangeWidth={handleChangeWidth}
                    onChangePositions={handleChangePositions}
                    allowResize={filter !== SCOPE_GRAPHIC}
                    polyglot={polyglot}
                />
            )}
            <PublicationModalWizard
                filter={filter}
                onExitEdition={handleExitEdition}
            />
        </div>
    );
};

FieldGridComponent.propTypes = {
    fields: PropTypes.array,
    filter: PropTypes.string,
    editField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    isSubresource: PropTypes.bool,
    addFieldButton: PropTypes.func.isRequired,
};

export const FieldGrid = compose(
    translate,
    connect(undefined, {
        loadField,
        editField,
        changePositions,
        saveFieldFromData,
    }),
)(FieldGridComponent);
