import React from 'react';
import { Field, propTypes as reduxFormPropTypes } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import FormTextField from '../../lib/FormTextField';

const TransformerArgListItem = ({ fieldName, transformerArg }) => (
    <Field
        name={`${fieldName}.value`}
        type="text"
        component={FormTextField}
        label={transformerArg.name}
    />
);

TransformerArgListItem.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

export default TransformerArgListItem;
