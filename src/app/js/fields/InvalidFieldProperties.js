import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Alert from '../lib/components/Alert';
import { fromFields } from '../sharedSelectors';
import { field as fieldPropTypes } from '../propTypes';

const InvalidFieldProperties = ({ invalidProperties, p: polyglot }) => {
    if (!invalidProperties.length) {
        return null;
    }

    return (
        <Alert>
            <ul>
                {invalidProperties.map(({ name, error }, index) => (
                    <li key={`${name}-${index}`}>
                        {polyglot.t(`error_${name}_${error}`)}
                    </li>
                ))}
            </ul>
        </Alert>
    );
};

InvalidFieldProperties.propTypes = {
    invalidProperties: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            error: PropTypes.string,
        }),
    ),
    p: fieldPropTypes,
};

const mapStateToprops = state => ({
    invalidProperties: fromFields.getInvalidProperties(state),
});

export default compose(translate, connect(mapStateToprops))(
    InvalidFieldProperties,
);
