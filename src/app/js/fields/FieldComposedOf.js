import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';

import { FIELD_FORM_NAME } from './';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';

const styles = {
    inset: {
        paddingLeft: 40,
    },
    compositionContainer: {
        display: 'flex',
    },
    select: {
        flexGrow: 2,
    },
    header: {
        paddingLeft: 0,
    },
};

export const FieldComposedOf = ({
    isComposedOf,
    columns,
    fields,
    handleToggle,
    handleSelectColumn,
    handleAddColumn,
    handleRemoveColumn,
    p: polyglot,
}) => (
    <div>
        <div style={styles.header}>{polyglot.t('wizard_composed_of')}</div>
        <div style={styles.inset}>
            <Toggle
                label="is_composite_field"
                toggled={isComposedOf}
                onToggle={handleToggle}
            />
            {isComposedOf &&
                columns.map((col, index) => (
                    <div
                        key={`composition_${index}`}
                        style={styles.compositionContainer}
                    >
                        <SelectField
                            className={`composite-field composite-field-${
                                index
                            }`}
                            onChange={handleSelectColumn(index)}
                            style={styles.select}
                            hintText={polyglot.t('select_a_column')}
                            value={col}
                        >
                            <MenuItem
                                className={'composite-field-none'}
                                value={null}
                                primaryText={polyglot.t('composite_field_none')}
                            />
                            {fields.map(f => (
                                <MenuItem
                                    className={`composite-field-${index}-${
                                        f.name
                                    }`}
                                    key={`composite-field-${index}-${f.name}`}
                                    value={f.name}
                                    primaryText={f.label}
                                />
                            ))}
                        </SelectField>
                        {index > 1 && (
                            <IconButton
                                className={`btn-remove-composite-field btn-remove-composite-field-${
                                    index
                                }`}
                                onClick={handleRemoveColumn(index)}
                                title={polyglot.t('remove_composition_column')}
                            >
                                <IconDelete />
                            </IconButton>
                        )}
                    </div>
                ))}
            {isComposedOf && (
                <FlatButton
                    className="btn-add-composition-column"
                    label={polyglot.t('add_composition_column')}
                    onClick={handleAddColumn}
                />
            )}
        </div>
    </div>
);

FieldComposedOf.propTypes = {
    isComposedOf: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    handleSelectColumn: PropTypes.func.isRequired,
    handleRemoveColumn: PropTypes.func.isRequired,
    handleToggle: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

FieldComposedOf.defaultProps = {
    isComposedOf: false,
    columns: [],
};

const mapStateToProps = (state, { FORM_NAME }) => {
    const composedOf = formValueSelector(FORM_NAME || FIELD_FORM_NAME)(
        state,
        'composedOf',
    );

    if (composedOf && composedOf.fields && composedOf.fields.length > 1) {
        return {
            isComposedOf: composedOf.isComposedOf,
            columns: composedOf.fields,
        };
    }

    return { isComposedOf: false, columns: [] };
};

const mapDispatchToProps = (dispatch, { FORM_NAME = FIELD_FORM_NAME }) => ({
    onChange: composedOf => {
        dispatch(change(FORM_NAME, 'composedOf', composedOf));
    },
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleToggle: ({ onChange, isComposedOf }) => () => {
            onChange({
                isComposedOf: !isComposedOf,
                fields: !isComposedOf ? ['', ''] : [],
            });
        },
        handleSelectColumn: ({ columns, isComposedOf, onChange }) => index => (
            event,
            key,
            column,
        ) => {
            onChange({
                isComposedOf,
                fields: [
                    ...columns.slice(0, index),
                    column,
                    ...columns.slice(index + 1),
                ],
            });
        },
        handleAddColumn: ({ isComposedOf, columns, onChange }) => () => {
            onChange({
                isComposedOf,
                fields: [...columns, ''],
            });
        },
        handleRemoveColumn: ({
            isComposedOf,
            columns,
            onChange,
        }) => index => () => {
            onChange({
                isComposedOf,
                fields: [
                    ...columns.slice(0, index),
                    ...columns.slice(index + 1),
                ],
            });
        },
    }),
    translate,
)(FieldComposedOf);
