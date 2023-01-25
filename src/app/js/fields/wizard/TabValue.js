import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { change } from 'redux-form';

import { FIELD_FORM_NAME } from '..';

import SourceValueToggleConnected from '../sourceValue/SourceValueToggle';

export const TabValueComponent = ({ subresourceUri, arbitraryMode }) => (
    <SourceValueToggleConnected
        selectedSubresourceUri={subresourceUri}
        arbitraryMode={arbitraryMode}
    />
);

TabValueComponent.propTypes = {
    subresourceUri: PropTypes.string,
    arbitraryMode: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
    handleChange: valueTransformers => {
        return dispatch(
            change(FIELD_FORM_NAME, 'transformers', valueTransformers),
        );
    },
});

export default compose(connect(null, mapDispatchToProps))(TabValueComponent);
