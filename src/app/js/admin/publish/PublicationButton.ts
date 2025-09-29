import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import { connect } from 'react-redux';

import { fromFields } from '../../sharedSelectors';
import PublishButton from './PublishButton';
import { fromConfigTenant, fromPublication } from '../selectors';
import compose from 'recompose/compose';
import { ClearPublishedButton } from '../clear/ClearPublishedButton';
import { RepublishAndClearButton } from './RepublishAndClearButton';

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    invalidFields: fromFields.getInvalidFields(state),
    // @ts-expect-error TS2339
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    // @ts-expect-error TS2339
    isEnableAutoPublication: fromConfigTenant.isEnableAutoPublication(state),
});

export default compose(
    connect(mapStateToProps),
    branch(
        // @ts-expect-error TS7031
        ({ hasPublishedDataset, isEnableAutoPublication }) =>
            hasPublishedDataset && isEnableAutoPublication,
        renderComponent(ClearPublishedButton),
    ),
    branch(
        // @ts-expect-error TS7031
        ({ hasPublishedDataset, isEnableAutoPublication }) =>
            hasPublishedDataset && !isEnableAutoPublication,
        renderComponent(RepublishAndClearButton),
    ),
)(PublishButton);
