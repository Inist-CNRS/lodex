import compose from 'recompose/compose';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import PublicationExcerpt from './PublicationExcerpt';
import PublicationEdition from './PublicationEdition';

export default compose(
    branch(
        props => props.editedColumn,
        renderComponent(PublicationEdition),
    ),
)(PublicationExcerpt);
