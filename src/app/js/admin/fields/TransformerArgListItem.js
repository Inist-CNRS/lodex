import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import { Field } from 'redux-form';

import FormTextField from '../../lib/FormTextField';

const TransformerArgListItem = ({ fieldName, transformerArg }) => (
    <Field
        className={`transformer_arg_${transformerArg.name}`}
        name={`${fieldName}.value`}
        type="text"
        component={FormTextField}
        label={transformerArg.name}
        multiLine={transformerArg.type === 'text'}
    />
);

TransformerArgListItem.propTypes = {
    fieldName: PropTypes.string.isRequired,
    transformerArg: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};

export default pure(TransformerArgListItem);
