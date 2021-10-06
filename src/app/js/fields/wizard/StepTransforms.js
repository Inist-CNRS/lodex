import React from 'react';
import { FieldArray, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/dist/translate';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { memoize } from 'lodash';

import Step from './Step';
import TransformerList from '../TransformerList';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { isSubresourceTransformation } from './StepValueSubresource';
import { FIELD_FORM_NAME } from '..';

const renderTransformer = memoize((locked, isSubresourceField) => props => {
    if (locked) {
        return (
            <span>
                {polyglot.t(
                    'transformer_no_editable_with_subresource_uid_value',
                )}
            </span>
        );
    }

    return (
        <TransformerList
            hideFirstTransformers={isSubresourceField ? 3 : 0}
            {...props}
        />
    );
});

export const StepTransformComponent = ({
    isSubresourceField,
    p: polyglot,
    locked,
    ...props
}) => (
    <Step id="step-transformers" label="field_wizard_step_tranforms" {...props}>
        <FieldArray
            name="transformers"
            component={renderTransformer(locked, isSubresourceField)}
            type="transform"
        />
    </Step>
);

StepTransformComponent.propTypes = {
    isSubresourceField: PropTypes.bool,
    locked: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    return {
        locked: isSubresourceTransformation(transformers || []),
    };
};

export default compose(
    connect(mapStateToProps),
    translate,
)(StepTransformComponent);
