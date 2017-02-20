/* eslint react/no-array-index-key: off */

import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import pure from 'recompose/pure';
import FlatButton from 'material-ui/FlatButton';

import { polyglot as polyglotPropTypes } from '../../propTypes';
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
        <FlatButton
            className="add-transformer"
            onClick={() => fields.push({})}
            label={polyglot.t('add_transformer')}
        />
    </div>
);

TransformerList.propTypes = {
    fields: PropTypes.shape({}).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
    }).isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
    pure,
)(TransformerList);
