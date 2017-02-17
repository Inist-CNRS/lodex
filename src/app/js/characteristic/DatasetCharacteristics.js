import compose from 'recompose/compose';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import { connect } from 'react-redux';
import { isLoggedIn } from '../user';
import DatasetCharacteristicsEdition from './DatasetCharacteristicsEdition';
import DatasetCharacteristicsView from './DatasetCharacteristicsView';
import { isCharacteristicEditing } from './';

const mapStateToProps = state => ({
    canEdit: isLoggedIn(state),
    editing: isCharacteristicEditing(state),
});

export default compose(
    connect(mapStateToProps),
    branch(
        props => props.canEdit && props.editing,
        renderComponent(DatasetCharacteristicsEdition),
    ),
)(DatasetCharacteristicsView);
