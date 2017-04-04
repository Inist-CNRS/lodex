/* eslint react/no-array-index-key: off */

import React, { PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { FIELD_FORM_NAME } from '../';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const styles = {
    inset: {
        paddingLeft: 40,
    },
    radio: {
        marginTop: 12,
    },
    select: {
        width: '100%',
    },
};

export const StepValueConcatComponent = ({
    handleSelect,
    p: polyglot,
    selected,
    columns,
    datasetFields,
    handleChange,
    handleAddColumn,
    handleRemoveColumn,
}) => (
    <div>
        <RadioButton
            label={polyglot.t('a_concat')}
            value="concat"
            onClick={handleSelect}
            checked={selected}
            style={styles.radio}
        />
        {selected &&
            <div style={styles.inset}>
                {columns.map((column, index) => (
                    <div key={`${column}_${index}`}>
                        <SelectField
                            id="select_column"
                            onChange={(event, key, value) => handleChange(event, key, value, index)}
                            style={styles.select}
                            hintText={polyglot.t('select_a_column')}
                            value={column}
                        >
                            {datasetFields.map(datasetField => (
                                <MenuItem
                                    key={datasetField}
                                    value={datasetField}
                                    primaryText={datasetField}
                                />
                            ))}
                        </SelectField>
                        <IconButton
                            tooltip={polyglot.t('remove_column')}
                            onClick={() => handleRemoveColumn(index)}
                        >
                            <ActionDeleteIcon />
                        </IconButton>
                    </div>
                ))}
                <FlatButton
                    label={polyglot.t('add_column')}
                    onClick={handleAddColumn}
                />
            </div>
        }
    </div>
);

StepValueConcatComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string),
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    handleRemoveColumn: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
};

StepValueConcatComponent.defaultProps = {
    columns: [null, null],
};

const mapStateToProps = (state) => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(state, 'transformers');
    const valueTransformer =
        transformers && transformers[0] && transformers[0].operation === 'CONCAT'
        ? transformers[0]
        : null;
    if (valueTransformer) {
        return {
            selected: true,
            columns: (valueTransformer.args && valueTransformer.args[0] && valueTransformer.args[0].value) || [],
        };
    }

    return { selected: false, columns: [] };
};

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleSelect: ({ onChange }) => () => {
            onChange({
                operation: 'CONCAT',
                args: [{
                    name: 'columns',
                    type: 'columns',
                    value: [null, null],
                }],
            });
        },
        handleChange: ({ onChange, columns }) => (event, key, value, index) => {
            onChange({
                operation: 'CONCAT',
                args: [{
                    name: 'columns',
                    type: 'columns',
                    value: [
                        ...columns.slice(0, index),
                        value,
                        ...columns.slice(index + 1),
                    ],
                }],
            });
        },
        handleAddColumn: ({ onChange, columns }) => {
            onChange({
                operation: 'CONCAT',
                args: [{
                    name: 'columns',
                    type: 'columns',
                    value: [...columns, null],
                }],
            });
        },
        handleRemoveColumn: ({ onChange, columns }) => (index) => {
            onChange({
                operation: 'CONCAT',
                args: [{
                    name: 'columns',
                    type: 'columns',
                    value: [
                        ...columns.slice(0, index),
                        ...columns.slice(index + 1),
                    ],
                }],
            });
        },
    }),
    translate,
)(StepValueConcatComponent);
