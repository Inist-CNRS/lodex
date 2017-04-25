import React, { PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { FIELD_FORM_NAME } from '../';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import SelectDatasetField from './SelectDatasetField';

const styles = {
    inset: {
        paddingLeft: 40,
    },
    radio: {
        marginTop: 12,
    },
};

export const StepValueColumnComponent = ({
    column,
    handleChange,
    handleSelect,
    p: polyglot,
    selected,
}) => (
    <div>
        <RadioButton
            label={polyglot.t('a_column')}
            value="column"
            onClick={handleSelect}
            checked={selected}
            style={styles.radio}
        />
        {selected &&
            <div style={styles.inset}>
                <SelectDatasetField
                    handleChange={handleChange}
                    label="select_a_column"
                    column={column}
                />
            </div>
        }
    </div>
);

StepValueColumnComponent.propTypes = {
    column: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
};

StepValueColumnComponent.defaultProps = {
    column: undefined,
};

const mapStateToProps = (state) => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(state, 'transformers');

    const valueTransformer =
        transformers && transformers[0] && transformers[0].operation === 'COLUMN'
        ? transformers[0]
        : null;

    if (valueTransformer) {
        return {
            selected: true,
            column: (valueTransformer.args && valueTransformer.args[0] && valueTransformer.args[0].value) || null,
        };
    }

    return { selected: false, column: null };
};

export default compose(
    connect(mapStateToProps),
    withState('column', 'setColumn', ({ column }) => column),
    withHandlers({
        handleSelect: ({ onChange, column }) => () => {
            onChange({
                operation: 'COLUMN',
                args: [{
                    name: 'column',
                    type: 'column',
                    value: column,
                }],
            });
        },
        handleChange: ({ onChange, setColumn }) => (event, key, value) => {
            setColumn(value);
            onChange({
                operation: 'COLUMN',
                args: [{
                    name: 'column',
                    type: 'column',
                    value,
                }],
            });
        },
    }),
    translate,
)(StepValueColumnComponent);
