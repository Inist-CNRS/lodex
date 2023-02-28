// TODO: check if this is still used
import { connect } from 'react-redux';

import Excerpt from '../preview/Excerpt';
import { fromPublicationPreview } from '../selectors';

const mapStateToProps = (state, { fields }) => ({
    lines: fromPublicationPreview.getPublicationPreview(state),
    columns: fields.filter(field => {
        // Remove subresource field uri from editable columns
        return !field.name.endsWith('_uri');
    }),
});

export default connect(mapStateToProps)(Excerpt);
