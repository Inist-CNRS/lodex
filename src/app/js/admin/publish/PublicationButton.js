import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import { connect } from 'react-redux';

import { fromFields } from '../../sharedSelectors';
import PublishButton from './PublishButton';
import ValidationButton from './ValidationButton';
import { fromPublication, fromProgress } from '../selectors';
import compose from 'recompose/compose';
import { ClearPublishedButton } from '../clear/ClearPublishedButton';
import { PUBLISH_DOCUMENT } from '../../../../common/progressStatus';

const mapStateToProps = state => ({
    invalidFields: fromFields.getInvalidFields(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    ...fromProgress.getProgress(state),
});

export default compose(
    connect(mapStateToProps),
    branch(
        ({ hasPublishedDataset, status }) =>
            hasPublishedDataset && status !== PUBLISH_DOCUMENT,
        renderComponent(ClearPublishedButton),
    ),
    branch(
        ({ invalidFields }) => invalidFields.length > 0,
        renderComponent(ValidationButton),
    ),
)(PublishButton);
