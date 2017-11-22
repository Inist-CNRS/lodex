/* eslint react/no-array-index-key: off */
import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

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

TransformerArgList.propTypes = {
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
    }).isRequired,
};

export default pure(TransformerArgList);
