import { connect } from 'react-redux';
import { compose } from 'recompose';
import withHandlers from 'recompose/withHandlers';
import { withRouter } from 'react-router';
import { formValueSelector, reduxForm } from 'redux-form';

import { createSubresource as createSubresourceAction } from '.';
import SubresourceForm from './SubresourceForm';

const mapStateToProps = state => ({
    pathSelected: formValueSelector('SUBRESOURCE_ADD_FORM')(state, 'path'),
    subresources: state.subresource.subresources,
});

export const AddSubresource = compose(
    withRouter,
    connect(mapStateToProps, { createSubresource: createSubresourceAction }),
    withHandlers({
        onSubmit: ({ createSubresource, history }) => resource => {
            createSubresource({
                resource,
                callback: id =>
                    history.push(`/display/document/subresource/${id}`),
            });
        },
    }),
    reduxForm({
        form: 'SUBRESOURCE_ADD_FORM',
        enableReinitialize: true,
    }),
)(SubresourceForm);
