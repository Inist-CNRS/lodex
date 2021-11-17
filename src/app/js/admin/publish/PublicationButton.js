import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import { connect } from 'react-redux';

import { fromFields } from '../../sharedSelectors';
import PublishButton from './PublishButton';
import ValidationButton from './ValidationButton';
import { fromPublication, fromPublish } from '../selectors';
import compose from 'recompose/compose';
import { ClearPublishedButton } from '../clear/ClearPublishedButton';

const mapStateToProps = state => ({
    invalidFields: fromFields.getInvalidFields(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    isLoading: fromPublish.getIsPublishing(state),
});

export default compose(
    connect(mapStateToProps),
    branch(
        ({ hasPublishedDataset, isLoading }) =>
            hasPublishedDataset && !isLoading,
        renderComponent(ClearPublishedButton),
    ),
    branch(
        ({ invalidFields }) => invalidFields.length > 0,
        renderComponent(ValidationButton),
    ),
)(PublishButton);
