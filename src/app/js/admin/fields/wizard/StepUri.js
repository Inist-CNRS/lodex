import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';

import { FieldArray, reduxForm } from 'redux-form';

import TransformerList from '../TransformerList';

export const StepUriComponent = () => (
    <div>
        <FieldArray name="transformers" component={TransformerList} type="value" />
    </div>
);

export default compose(
    withProps(({ field }) => ({ initialValues: field })),
    reduxForm({
        form: 'field_wizard',
        enableReinitialize: true,
    }),
)(StepUriComponent);
