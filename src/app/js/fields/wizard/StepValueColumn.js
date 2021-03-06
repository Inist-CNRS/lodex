import React from 'react';
import PropTypes from 'prop-types';
import { Switch, FormControlLabel } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { FIELD_FORM_NAME } from '../';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import SelectDatasetField from './SelectDatasetField';
import { isSubresourceTransformation } from './StepValueSubresource';
import { isSubresourceFieldTransformation } from './StepValueSubresourceField';

const styles = {
    inset: {
        paddingLeft: 40,
    },
};

export const StepValueColumnComponent = ({
    column,
    handleChange,
    handleSelect,
    p: polyglot,
    selected,
}) => (
    <div id="step-value-column">
        <FormControlLabel
            control={
                <Switch
                    value="column"
                    onChange={handleSelect}
                    checked={selected}
                />
            }
            label={polyglot.t('a_column')}
        />
        {selected && (
            <div style={styles.inset}>
                <SelectDatasetField
                    handleChange={handleChange}
                    label="select_a_column"
                    column={column}
                />
            </div>
        )}
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
    column: '',
};

const mapStateToProps = state => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    const valueTransformer =
        transformers &&
        transformers[0] &&
        transformers[0].operation === 'COLUMN'
            ? transformers[0]
            : null;

    if (valueTransformer) {
        return {
            selected:
                !isSubresourceTransformation(transformers) &&
                !isSubresourceFieldTransformation(transformers),
            column:
                (valueTransformer.args &&
                    valueTransformer.args[0] &&
                    valueTransformer.args[0].value) ||
                null,
        };
    }

    return { selected: false, column: null };
};

export default compose(
    connect(mapStateToProps),
    withState('column', 'setColumn', ({ column }) => column),
    withHandlers({
        handleSelect: ({ onChange, column }) => () => {
            onChange([
                {
                    operation: 'COLUMN',
                    args: [
                        {
                            name: 'column',
                            type: 'column',
                            value: column,
                        },
                    ],
                },
            ]);
        },
        handleChange: ({ onChange, setColumn }) => value => {
            setColumn(value);
            onChange([
                {
                    operation: 'COLUMN',
                    args: [
                        {
                            name: 'column',
                            type: 'column',
                            value,
                        },
                    ],
                },
            ]);
        },
    }),
    translate,
)(StepValueColumnComponent);
