import { connect } from 'react-redux';

import Excerpt from '../Excerpt';

import { fromPublicationPreview } from '../../selectors';
import { fromFields } from '../../../sharedSelectors';

const mapStateToProps = state => ({
    lines: fromPublicationPreview.getPublicationPreview(state),
    columns: fromFields.getFields(state),
});

export default connect(mapStateToProps)(Excerpt);
