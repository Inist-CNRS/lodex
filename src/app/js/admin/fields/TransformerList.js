/* eslint react/no-array-index-key: off */

import React from 'react';
import { compose } from 'recompose';
import translate from 'redux-polyglot/translate';
import FlatButton from 'material-ui/FlatButton';
import { propTypes as reduxFormPropTypes } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import TransformerListItem from './TransformerListItem';

const TransformerList = ({ fields, meta: { touched, error }, p: polyglot }) => (
    <div>
        <FlatButton onClick={() => fields.push({})}>{polyglot.t('add_transformer')}</FlatButton>
        {touched && error && <span>{error}</span>}

        {fields.map((fieldName, index) => (
            <TransformerListItem
                key={index}
                fieldName={fieldName}
                onRemove={fields.remove}
                operation={fields.get(index).operation}
            />
        ))}
    </div>
);

TransformerList.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(TransformerList);
