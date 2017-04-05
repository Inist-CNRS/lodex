/* eslint react/no-array-index-key: off */

import React, { PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import TextField from 'material-ui/TextField';
import get from 'lodash.get';

import { FIELD_FORM_NAME } from '../';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import ConcatField from './ConcatField';

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
    separator,
    handleChange,
    handleSeparatorChange,
    handleAddColumn,
    handleRemoveColumn,
}) => (
    <div>
        <RadioButton
            label={polyglot.t('multi_field_concat')}
            value="concat"
            onClick={handleSelect}
            checked={selected}
            style={styles.radio}
        />
        {selected &&
            <div style={styles.inset}>
                <TextField
                    id="textbox_value"
                    fullWidth
                    placeholder={polyglot.t('separator')}
                    onChange={handleSeparatorChange}
                    value={separator}
                />
                {columns.map((column, index) => (
                    <ConcatField
                        key={index}
                        index={index}
                        column={column}
                        removable={index > 1}
                        handleChange={handleChange}
                        handleRemoveColumn={handleRemoveColumn}
                    />

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
    handleChange: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    handleRemoveColumn: PropTypes.func.isRequired,
    handleSeparatorChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
    separator: PropTypes.string.isRequired,
};

StepValueConcatComponent.defaultProps = {
    columns: [null, null],
};

const mapStateToProps = (state) => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(state, 'transformers');
    const valueTransformer =
        get(transformers, '[0].operation') === 'CONCAT_URI'
        ? transformers[0]
        : null;
    if (valueTransformer) {
        return {
            selected: true,
            separator: get(valueTransformer, 'args[0].value', ''),
            columns: get(valueTransformer, 'args', []).slice(1).map(({ value }) => value) || [],
            args: valueTransformer.args || [],
        };
    }

    return { selected: false, columns: [], separator: '' };
};

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleSelect: ({ onChange }) => () => {
            onChange({
                operation: 'CONCAT_URI',
                args: [{
                    name: 'separator',
                    type: 'string',
                    value: '',
                }, {
                    name: 'column',
                    type: 'column',
                    value: null,
                }, {
                    name: 'column',
                    type: 'column',
                    value: null,
                }],
            });
        },
        handleChange: ({ onChange, args }) => (event, key, value, index) => {
            onChange({
                operation: 'CONCAT_URI',
                args: [
                    ...args.slice(0, index + 1),
                    {
                        name: 'column',
                        type: 'column',
                        value,
                    },
                    ...args.slice(index + 2),
                ],
            });
        },
        handleSeparatorChange: ({ onChange, args }) => (event, value) => {
            onChange({
                operation: 'CONCAT_URI',
                args: [
                    { name: 'separator', type: 'string', value },
                    ...args.slice(1),
                ],
            });
        },
        handleAddColumn: ({ onChange, args }) => {
            onChange({
                operation: 'CONCAT_URI',
                args: [
                    ...args,
                    {
                        name: 'column',
                        type: 'column',
                        value: null,
                    },
                ],
            });
        },
        handleRemoveColumn: ({ onChange, args }) => (index) => {
            onChange({
                operation: 'CONCAT_URI',
                args: [
                    ...args.slice(0, index + 1),
                    ...args.slice(index + 2),
                ],
            });
        },
    }),
    translate,
)(StepValueConcatComponent);
