import React, { PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
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
    <div>
        <RadioButton
            className="radio_value"
            label={polyglot.t('a_value')}
            value="value"
            onClick={handleSelect}
            checked={selected}
            style={styles.radio}
        />
        {selected &&
            <div style={styles.inset}>
                <TextField
                    id="textbox_value"
                    fullWidth
                    placeholder={polyglot.t('enter_a_value')}
                    onChange={handleChange}
                    value={value}
                />
            </div>
        }
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

const mapStateToProps = (state) => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(state, 'transformers');

    const valueTransformer =
        transformers && transformers[0] && transformers[0].operation === 'VALUE'
        ? transformers[0]
        : null;

    if (valueTransformer) {
        return {
            selected: true,
            value: (valueTransformer.args && valueTransformer.args[0] && valueTransformer.args[0].value) || '',
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
                args: [{
                    name: 'value',
                    type: 'string',
                    value,
                }],
            });
        },
        handleChange: ({ onChange }) => (event) => {
            onChange({
                operation: 'VALUE',
                args: [{
                    name: 'value',
                    type: 'string',
                    value: event.target.value,
                }],
            });
        },
    }),
    translate,
)(StepValueValueComponent);
