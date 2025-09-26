import { connect } from 'react-redux';
// @ts-expect-error TS7016
import { compose } from 'recompose';
// @ts-expect-error TS7016
import withHandlers from 'recompose/withHandlers';
// @ts-expect-error TS7016
import { withRouter } from 'react-router';
// @ts-expect-error TS7016
import { formValueSelector, reduxForm } from 'redux-form';

import { createSubresource as createSubresourceAction } from '.';
import SubresourceForm from './SubresourceForm';

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    pathSelected: formValueSelector('SUBRESOURCE_ADD_FORM')(state, 'path'),
    subresources: state.subresource.subresources,
});

export const AddSubresource = compose(
    withRouter,
    connect(mapStateToProps, { createSubresource: createSubresourceAction }),
    withHandlers({
        onSubmit:
            // @ts-expect-error TS7031


                ({ createSubresource, history }) =>
                // @ts-expect-error TS7006
                (resource) => {
                    createSubresource({
                        resource,
                        // @ts-expect-error TS7006
                        callback: (id) =>
                            history.push(`/display/document/subresource/${id}`),
                    });
                },
    }),
    reduxForm({
        form: 'SUBRESOURCE_ADD_FORM',
        enableReinitialize: true,
    }),
)(SubresourceForm);
