/* eslint react/no-array-index-key: off */
import React from 'react';
import { propTypes as reduxFormPropTypes } from 'redux-form';

import TransformerArgListItem from './TransformerArgListItem';

const TransformerArgList = ({ fields }) => (
    <div>
        {fields.map((fieldName, index) => (
            <TransformerArgListItem
                key={index}
                fieldName={fieldName}
                onRemove={fields.remove}
                transformerArg={fields.get(index)}
            />
        ))}
    </div>
);

TransformerArgList.propTypes = reduxFormPropTypes;

export default TransformerArgList;
