/* eslint react/no-array-index-key: off */

import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import pure from 'recompose/pure';

import FlatButton from 'material-ui/FlatButton';
import { propTypes as reduxFormPropTypes } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import TransformerListItem from './TransformerListItem';

const TransformerList = ({ fields, meta: { touched, error }, p: polyglot }) => (
    <div>
        {touched && error && <span>{error}</span>}

        {fields.map((fieldName, index) => (
            <TransformerListItem
                key={index}
                fieldName={fieldName}
                onRemove={() => fields.remove(index)}
                operation={fields.get(index).operation}
            />
        ))}
        <FlatButton onClick={() => fields.push({})} label={polyglot.t('add_transformer')} />
    </div>
);

TransformerList.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
    pure,
)(TransformerList);
