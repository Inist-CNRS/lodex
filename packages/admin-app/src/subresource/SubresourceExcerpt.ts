import { connect } from 'react-redux';

import Excerpt from '../preview/Excerpt';
import { fromPublicationPreview } from '../selectors';
import type { State } from '../reducers';

const mapStateToProps = (
    state: State,
    { fields }: { fields: { name: string }[] },
) => ({
    lines: fromPublicationPreview.getPublicationPreview(state),
    columns: fields.filter((field) => {
        // Remove subresource field uri from editable columns
        return !field.name.endsWith('_uri');
    }),
});

export default connect(mapStateToProps)(Excerpt);
