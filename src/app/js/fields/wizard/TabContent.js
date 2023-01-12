import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { reduxForm } from 'redux-form';
import { Box } from '@material-ui/core';

import { FIELD_FORM_NAME } from '../';

export const TabContentComponent = ({ children }) => {
    return <Box>{children}</Box>;
};

TabContentComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default compose(
    withProps(({ field, filter }) => {
        const fieldFilterAttributes = filter
            ? {
                  scope: filter,
                  display: field ? field.display : true,
              }
            : {};

        return { initialValues: { ...field, ...fieldFilterAttributes } };
    }),
    reduxForm({
        form: FIELD_FORM_NAME,
        enableReinitialize: true,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
    }),
)(TabContentComponent);
