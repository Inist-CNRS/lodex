import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import pure from 'recompose/pure';
import FlatButton from 'material-ui/FlatButton';
import { CardHeader } from 'material-ui/Card';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import TransformerListItem from './TransformerListItem';

const TransformerList = ({ fields, meta: { touched, error }, p: polyglot }) => (
    <div>
        <CardHeader>{polyglot.t('transformers')}</CardHeader>
        {touched && error && <span>{error}</span>}

        {fields.map((fieldName, index) => (
            <TransformerListItem
                key={fieldName}
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
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
        get: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
    }).isRequired,
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
