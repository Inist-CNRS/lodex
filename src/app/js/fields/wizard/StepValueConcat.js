import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Button } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import get from 'lodash.get';

import { FIELD_FORM_NAME } from '../';
import { polyglot as polyglotPropTypes } from '../../propTypes';
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
    <div id="step-value-concat">
        <Switch
            label={polyglot.t('multi_field_concat')}
            value="concat"
            onChange={handleSelect}
            checked={selected}
            style={styles.radio}
        />
        {selected && (
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
                <Button
                    variant="text"
                    label={polyglot.t('add_column')}
                    onClick={handleAddColumn}
                />
            </div>
        )}
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

const mapStateToProps = state => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );
    const valueTransformer =
        get(transformers, '[0].operation') === 'CONCAT'
            ? transformers[0]
            : null;
    if (valueTransformer) {
        const args = get(valueTransformer, 'args', []);
        return {
            selected: true,
            columns: args.map(({ value }) => value),
            args,
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
                args: [
                    {
                        name: 'column',
                        type: 'column',
                        value: null,
                    },
                    {
                        name: 'column',
                        type: 'column',
                        value: null,
                    },
                ],
            });
        },
        handleChange: ({ onChange, args }) => (event, key, value, index) => {
            onChange({
                operation: 'CONCAT',
                args: [
                    ...args.slice(0, index),
                    {
                        name: 'column',
                        type: 'column',
                        value,
                    },
                    ...args.slice(index + 1),
                ],
            });
        },
        handleAddColumn: ({ onChange, args }) => {
            onChange({
                operation: 'CONCAT',
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
        handleRemoveColumn: ({ onChange, args }) => index => {
            onChange({
                operation: 'CONCAT',
                args: [...args.slice(0, index), ...args.slice(index + 1)],
            });
        },
    }),
    translate,
)(StepValueConcatComponent);
