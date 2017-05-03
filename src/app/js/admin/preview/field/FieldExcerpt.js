import { connect } from 'react-redux';

import Excerpt from '../Excerpt';

import { fromFieldPreview } from '../../selectors';
import { getFieldFormData } from '../../../fields';

const mapStateToProps = (state) => {
    const editedField = getFieldFormData(state);
    return {
        lines: fromFieldPreview.getFieldPreview(state),
        columns: editedField ? [editedField] : [],
    };
};

export default connect(mapStateToProps)(Excerpt);
