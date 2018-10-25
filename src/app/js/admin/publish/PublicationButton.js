import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import { connect } from 'react-redux';
import { fromFields } from '../../sharedSelectors';
import PublishButton from './PublishButton';
import ValidationButton from './ValidationButton';

const mapStateToProps = state => ({
    invalidFields: fromFields.getInvalidFields(state),
});

export default connect(mapStateToProps)(
    branch(
        ({ invalidFields }) => invalidFields.length > 0,
        renderComponent(ValidationButton),
    )(PublishButton),
);
