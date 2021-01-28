import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import HiddenIcon from '@material-ui/icons/VisibilityOff';
import translate from 'redux-polyglot/translate';
import compose from 'lodash.compose';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../propTypes';

import PublicationModalWizard from '../fields/wizard';
import { loadField, editField } from '../fields';
import { makeStyles } from '@material-ui/core';
import { getShortText, isLongText } from '../lib/longTexts';
import { NoField } from './NoField';

const useStyles = makeStyles({
    root: {
        padding: '1rem',
        border: '1px dashed #ccc',
        borderRadius: 5,
        overflow: 'hidden',
        display: 'flex',
        flexFlow: 'row wrap',
    },
    propertyContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    property: {
        border: '1px solid #ccc',
        borderRadius: 3,
        padding: 40,
        margin: 10,
        textAlign: 'center',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#444',
        '&:hover': {
            background: '#efefef',
        },
    },
    propertyLabel: {
        marginRight: 10,
    },
    actionsContainer: {
        marginLeft: 'auto',
        padding: '20px 10px 20px 0',
    },
});

const ensureTextIsShort = text =>
    isLongText(text) ? getShortText(text) : text;

const FieldGridComponent = ({
    fields,
    filter,
    editField,
    p: polyglot,
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

    return (
        <div className={classes.root}>
            {fields.length === 0 ? (
                <NoField
                    addFieldButton={addFieldButton}
                    label={polyglot.t('no_field_for_resource')}
                />
            ) : (
                <>
                    <div className={classes.actionsContainer}>
                        {addFieldButton}
                    </div>
                    {fields.map(field => (
                        <div
                            key={field.name}
                            className={classes.propertyContainer}
                            style={{ width: `${field.width || 100}%` }}
                        >
                            <div
                                onClick={() => editField(field.name)}
                                className={classes.property}
                            >
                                <span
                                    className={classes.propertyLabel}
                                    data-field-name={field.name}
                                >
                                    {ensureTextIsShort(field.label)}
                                    {` (${ensureTextIsShort(field.name)})`}
                                </span>
                                {!field.display && <HiddenIcon />}
                            </div>
                        </div>
                    ))}
                </>
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
    addFieldButton: PropTypes.func.isRequired,
};

export const FieldGrid = compose(
    translate,
    connect(undefined, { loadField, editField }),
)(FieldGridComponent);
