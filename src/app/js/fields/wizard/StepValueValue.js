import React from 'react';
import PropTypes from 'prop-types';
import { Switch, TextField, FormControlLabel } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { FIELD_FORM_NAME } from '../';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    inset: {
        paddingLeft: 40,
    },
    radio: {
        marginTop: 12,
    },
};

export const StepValueValueComponent = ({
    handleChange,
    handleSelect,
    p: polyglot,
    selected,
    value,
}) => (
    <div id="step-value-value">
        <FormControlLabel
            control={
                <Switch
                    className="radio_value"
                    value="value"
                    onChange={handleSelect}
                    checked={selected}
                    style={styles.radio}
                />
            }
            label={polyglot.t('a_value')}
        />
        {selected && (
            <div style={styles.inset}>
                <TextField
                    id="textbox_value"
                    fullWidth
                    placeholder={polyglot.t('enter_a_value')}
                    onChange={handleChange}
                    value={value}
                />
            </div>
        )}
    </div>
);

StepValueValueComponent.propTypes = {
    handleChange: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
    value: PropTypes.string,
};
StepValueValueComponent.defaultProps = {
    value: undefined,
};

const mapStateToProps = state => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    const valueTransformer =
        transformers && transformers[0] && transformers[0].operation === 'VALUE'
            ? transformers[0]
            : null;

    if (valueTransformer) {
        return {
            selected: true,
            value:
                (valueTransformer.args &&
                    valueTransformer.args[0] &&
                    valueTransformer.args[0].value) ||
                '',
        };
    }

    return { selected: false, value: null };
};

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleSelect: ({ onChange, value }) => () => {
            onChange({
                operation: 'VALUE',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                        value,
                    },
                ],
            });
        },
        handleChange: ({ onChange }) => event => {
            onChange({
                operation: 'VALUE',
                args: [
                    {
                        name: 'value',
                        type: 'string',
                        value: event.target.value,
                    },
                ],
            });
        },
    }),
    translate,
)(StepValueValueComponent);
