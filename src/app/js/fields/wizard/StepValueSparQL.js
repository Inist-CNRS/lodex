import React from 'react';
import PropTypes from 'prop-types';
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

export const StepValueSparQLComponent = ({
    handleChange,
    handleSelect,
    p: polyglot,
    selected,
    sparql,
}) => (
    <div>
        <RadioButton
            className="radio_sparql"
            label={polyglot.t('sparql_value')}
            value="sparql"
            onClick={handleSelect}
            checked={selected}
            style={styles.radio}
        />
        {selected && (
            <div style={styles.inset}>
                <TextField
                    id="textbox_select"
                    fullWidth
                    placeholder={polyglot.t('enter_sparql')}
                    onChange={handleChange}
                    value={sparql}
                />
            </div>
        )}
    </div>
);

StepValueSparQLComponent.propTypes = {
    handleChange: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
    sparql: PropTypes.string,
};
StepValueSparQLComponent.defaultProps = {
    sparql: undefined,
};

const mapStateToProps = state => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    const valueTransformer =
        transformers &&
        transformers[0] &&
        transformers[0].operation === 'SPARQL'
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
                operation: 'SPARQL',
                args: [
                    {
                        name: 'sparql',
                        type: 'string',
                        value,
                    },
                ],
            });
        },
        handleChange: ({ onChange }) => event => {
            onChange({
                operation: 'SPARQL',
                args: [
                    {
                        name: 'sparql',
                        type: 'string',
                        value: event.target.value,
                    },
                ],
            });
        },
    }),
    translate,
)(StepValueSparQLComponent);
