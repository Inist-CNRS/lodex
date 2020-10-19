import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import pure from 'recompose/pure';
import { ListSubheader, Button } from '@material-ui/core';
import memoize from 'lodash.memoize';

import { polyglot as polyglotPropTypes } from '../propTypes';
import TransformerListItem from './TransformerListItem';

import {
    getTransformerMetas,
    hasRegistredTransformer,
} from '../../../common/transformers';

const styles = {
    header: {
        fontSize: '16px',
        paddingLeft: 0,
    },
};

const showTransformer = memoize(
    (operation, type) =>
        !type ||
        !operation ||
        /**
         * We need to display the transformer in case it doesn't exist anymore
         * This way we can change it for legacy model imports
         */
        !hasRegistredTransformer(operation) ||
        getTransformerMetas(operation).type === type,
    (operation, type) => `${operation}_${type}`,
);

const TransformerList = ({
    fields,
    meta: { touched, error },
    type,
    p: polyglot,
}) => (
    <div>
        <ListSubheader style={styles.header}>
            {polyglot.t('transformers')}
            <Button
                variant="text"
                className="add-transformer"
                onClick={() => fields.push({})}
                label={polyglot.t('add_transformer')}
            />
        </ListSubheader>
        {touched && error && <span>{error}</span>}
        {fields.map((fieldName, index) => (
            <TransformerListItem
                key={fieldName}
                fieldName={fieldName}
                onRemove={() => fields.remove(index)}
                operation={fields.get(index).operation}
                type={type}
                show={showTransformer(fields.get(index).operation, type)}
            />
        ))}
    </div>
);

TransformerList.propTypes = {
    fields: PropTypes.shape({
        map: PropTypes.func.isRequired,
        get: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
    }).isRequired,
    p: polyglotPropTypes.isRequired,
    type: PropTypes.string,
};

TransformerList.defaultProps = {
    type: null,
};

export default compose(translate, pure)(TransformerList);
