// TODO: check if this is still used
import { connect } from 'react-redux';

import Excerpt from '../preview/Excerpt';
import { fromPublicationPreview } from '../selectors';

// @ts-expect-error TS7006
const mapStateToProps = (state, { fields }) => ({
    // @ts-expect-error TS2339
    lines: fromPublicationPreview.getPublicationPreview(state),
    // @ts-expect-error TS7006
    columns: fields.filter((field) => {
        // Remove subresource field uri from editable columns
        return !field.name.endsWith('_uri');
    }),
});

export default connect(mapStateToProps)(Excerpt);
