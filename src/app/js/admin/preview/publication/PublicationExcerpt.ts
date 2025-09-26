import { connect } from 'react-redux';

import Excerpt from '../Excerpt';
import { fromPublicationPreview } from '../../selectors';

// @ts-expect-error TS7006
const mapStateToProps = (state, { fields }) => ({
    // @ts-expect-error TS2339
    lines: fromPublicationPreview.getPublicationPreview(state),
    columns: fields,
});

export default connect(mapStateToProps)(Excerpt);
