import { connect } from 'react-redux';

import Excerpt from '../Excerpt';

import { fromFieldPreview } from '../../selectors';
import { getFieldFormData } from '../../fields';

const mapStateToProps = state => ({
    lines: fromFieldPreview.getFieldPreview(state),
    columns: [getFieldFormData(state)],
});

export default connect(mapStateToProps)(Excerpt);
