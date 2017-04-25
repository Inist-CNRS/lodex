import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import { connect } from 'react-redux';
import { fromFields } from '../../sharedSelectors';
import PublishButton from './PublishButton';
import ValidationButton from './ValidationButton';

const mapStateToProps = state => ({
    fields: fromFields.getInvalidFields(state),
});

export default connect(mapStateToProps)(branch(
    ({ fields }) => fields.length > 0,
    renderComponent(ValidationButton),
)(PublishButton));
