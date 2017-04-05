/* eslint react/no-array-index-key: off */

import React, { PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

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
    handleChange,
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
            columns: (
                valueTransformer.args &&
                valueTransformer.args[0] &&
                valueTransformer.args.map(({ value }) => value)
            ) || [],
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
        handleChange: ({ onChange, columns }) => (event, key, value, index) => {
            onChange({
                operation: 'CONCAT',
                args: [
                    ...columns.slice(0, index),
                    value,
                    ...columns.slice(index + 1),
                ].map(v => ({
                    name: 'column',
                    type: 'column',
                    value: v,
                })),
            });
        },
        handleAddColumn: ({ onChange, columns }) => {
            onChange({
                operation: 'CONCAT',
                args: [...columns, null].map(v => ({
                    name: 'column',
                    type: 'column',
                    value: v,
                })),
            });
        },
        handleRemoveColumn: ({ onChange, columns }) => (index) => {
            onChange({
                operation: 'CONCAT',
                args: [
                    ...columns.slice(0, index),
                    ...columns.slice(index + 1),
                ].map(v => ({
                    name: 'column',
                    type: 'column',
                    value: v,
                })),
            });
        },
    }),
    translate,
)(StepValueConcatComponent);
