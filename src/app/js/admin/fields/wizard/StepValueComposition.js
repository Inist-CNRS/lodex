import React, { PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete';
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
    compositionContainer: {
        display: 'flex',
    },
    select: {
        flexGrow: 2,
    },
};

export const StepValueCompositionComponent = ({
    columns,
    datasetFields,
    handleAddColumn,
    handleChangeSeparator,
    handleSelectColumn,
    handleSelect,
    handleRemoveColumn,
    p: polyglot,
    selected,
    separator,
}) => (
    <div>
        <RadioButton
            label={polyglot.t('a_composition')}
            value="composition"
            onClick={handleSelect}
            checked={selected}
            style={styles.radio}
        />
        {selected &&
            <div style={styles.inset}>
                {columns.map((col, index) => (
                    <div
                        key={`compotransformerssition_${index}`} // eslint-disable-line
                        style={styles.compositionContainer}
                    >
                        <SelectField
                            onChange={handleSelectColumn(index)}
                            style={styles.select}
                            hintText={polyglot.t('select_a_column')}
                            value={col}
                        >
                            {datasetFields.map(column => (
                                <MenuItem
                                    key={`select_composition_${index}_${column}`} // eslint-disable-line
                                    insetChildren
                                    value={column}
                                    primaryText={column}
                                />
                            ))}
                        </SelectField>
                        {index > 1 &&
                            <IconButton
                                onClick={handleRemoveColumn(index)}
                                title={polyglot.t('remove_composition_column')}
                            >
                                <IconDelete />
                            </IconButton>
                        }
                    </div>
                ))}
                <FlatButton
                    label={polyglot.t('add_composition_column')}
                    onClick={handleAddColumn}
                />
                <TextField
                    id="textbox_separator"
                    fullWidth
                    placeholder={polyglot.t('enter_a_separator')}
                    onChange={handleChangeSeparator}
                    value={separator}
                />
            </div>
        }
    </div>
);

StepValueCompositionComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    handleChangeSeparator: PropTypes.func.isRequired,
    handleSelectColumn: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleRemoveColumn: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
    separator: PropTypes.string,
};

StepValueCompositionComponent.defaultProps = {
    columns: ['', ''],
    separator: undefined,
};

const mapStateToProps = (state) => {
    const composedOf = formValueSelector(FIELD_FORM_NAME)(state, 'composedOf');

    if (composedOf && composedOf.fields.length > 1) {
        return {
            selected: true,
            columns: composedOf.fields || ['', ''],
            separator: composedOf.separator || '',
        };
    }

    return { selected: false, columns: ['', ''], separator: '' };
};

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleSelect: ({ onChange, columns, separator }) => () => {
            onChange({
                fields: columns,
                separator,
            });
        },
        handleChangeSeparator: ({ columns, onChange }) => (event) => {
            onChange({
                fields: columns,
                separator: event.target.value,
            });
        },
        handleSelectColumn: ({ columns, onChange, separator }) => index => (event, key, column) => {
            onChange({
                fields: [
                    ...columns.slice(0, index),
                    column,
                    ...columns.slice(index + 1),
                ],
                separator,
            });
        },
        handleAddColumn: ({ columns, onChange, separator }) => () => {
            onChange({
                fields: [
                    ...columns,
                    '',
                ],
                separator,
            });
        },
        handleRemoveColumn: ({ columns, onChange, separator }) => index => () => {
            onChange({
                fields: [
                    ...columns.slice(0, index),
                    ...columns.slice(index + 1),
                ],
                separator,
            });
        },
    }),
    translate,
)(StepValueCompositionComponent);
