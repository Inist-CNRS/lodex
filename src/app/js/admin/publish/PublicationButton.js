import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import { connect } from 'react-redux';

import { fromFields } from '../../sharedSelectors';
import PublishButton from './PublishButton';
import { fromConfigTenant, fromPublication } from '../selectors';
import compose from 'recompose/compose';
import { ClearPublishedButton } from '../clear/ClearPublishedButton';
import { RepublishAndClearButton } from './RepublishAndClearButton';

const mapStateToProps = (state) => ({
    invalidFields: fromFields.getInvalidFields(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    isEnableAutoPublication: fromConfigTenant.isEnableAutoPublication(state),
});

export default compose(
    connect(mapStateToProps),
    branch(
        ({ hasPublishedDataset, isEnableAutoPublication }) =>
            hasPublishedDataset && isEnableAutoPublication,
        renderComponent(ClearPublishedButton),
    ),
    branch(
        ({ hasPublishedDataset, isEnableAutoPublication }) =>
            hasPublishedDataset && !isEnableAutoPublication,
        renderComponent(RepublishAndClearButton),
    ),
)(PublishButton);
