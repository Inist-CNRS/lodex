import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { change } from 'redux-form';

import { FIELD_FORM_NAME } from '..';

import TabValueValue from './TabValueValue';
import TabValueColumn from './TabValueColumn';
import TabValueConcat from './TabValueConcat';
import TabValueSubresource from './TabValueSubresource';
import TabValueSubresourceField from './TabValueSubresourceField';
import TabValueSubresourceColumn from './TabValueSubresourceColumn';
import SourceValueToggleConnected from '../sourceValue/SourceValueToggle';

export const TabValueComponent = ({
    subresourceUri,
    handleChange,
    arbitraryMode,
}) => (
    <>
        <TabValueValue onChange={handleChange} />
        {!arbitraryMode && (
            <>
                {subresourceUri ? (
                    <TabValueSubresourceColumn
                        subresourceUri={subresourceUri}
                        onChange={handleChange}
                    />
                ) : (
                    <>
                        <TabValueColumn onChange={handleChange} />
                        <TabValueConcat onChange={handleChange} />
                        <TabValueSubresource onChange={handleChange} />
                        <TabValueSubresourceField onChange={handleChange} />
                    </>
                )}
            </>
        )}
        <SourceValueToggleConnected />
    </>
);

TabValueComponent.propTypes = {
    subresourceUri: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
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
