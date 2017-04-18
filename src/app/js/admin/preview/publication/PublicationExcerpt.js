import { connect } from 'react-redux';

import Excerpt from '../Excerpt';

import { fromPublicationPreview, fromFields } from '../../selectors';

const mapStateToProps = state => ({
    lines: fromPublicationPreview.getPublicationPreview(state),
    columns: fromFields.getFields(state),
});

export default connect(mapStateToProps)(Excerpt);
