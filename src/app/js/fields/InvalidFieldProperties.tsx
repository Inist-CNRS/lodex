// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Alert from '../lib/components/Alert';
import { fromFields } from '../sharedSelectors';
import { field as fieldPropTypes } from '../propTypes';
import { translate } from '../i18n/I18NContext';

// @ts-expect-error TS7031
const InvalidFieldProperties = ({ invalidProperties, p: polyglot }) => {
    if (!invalidProperties.length) {
        return null;
    }

    return (
        <Alert>
            <ul>
                {/*
                 // @ts-expect-error TS7031 */}
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

// @ts-expect-error TS7006
const mapStateToprops = (state) => ({
    // @ts-expect-error TS2339
    invalidProperties: fromFields.getInvalidProperties(state),
});

export default compose(
    translate,
    connect(mapStateToprops),
    // @ts-expect-error TS2345
)(InvalidFieldProperties);
