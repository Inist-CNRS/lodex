import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import { connect } from 'react-redux';

import { fromFields } from '../../sharedSelectors';
import PublishButton from './PublishButton';
import ValidationButton from './ValidationButton';
import { fromPublication } from '../selectors';
import compose from 'recompose/compose';
import { ClearPublishedButton } from '../clear/ClearPublishedButton';

const mapStateToProps = state => ({
    invalidFields: fromFields.getInvalidFields(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

export default compose(
    connect(mapStateToProps),
    branch(
        ({ hasPublishedDataset }) => hasPublishedDataset,
        renderComponent(ClearPublishedButton),
    ),
    branch(
        ({ invalidFields }) => invalidFields.length > 0,
        renderComponent(ValidationButton),
    ),
)(PublishButton);
