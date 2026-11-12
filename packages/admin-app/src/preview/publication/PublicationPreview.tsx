import { connect } from 'react-redux';
import compose from 'recompose/compose';

import PublicationExcerpt from './PublicationExcerpt';
import { fromFields } from '@lodex/frontend-common/sharedSelectors';

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 100px - 76px - 72px)',
    },
    content: {
        overflow: 'auto',
    },
    button: {
        float: 'right',
        marginRight: '2rem',
    },
};

interface PublicationPreviewComponentProps {
    fields: unknown[];
}

// fields come from the publication loaded by DisplayRoute (withInitialData)
const PublicationPreviewComponent = ({
    fields,
}: PublicationPreviewComponentProps) => {
    return (
        // @ts-expect-error TS2322
        <div style={styles.container} className="publication-preview">
            {/*
             // @ts-expect-error TS2322 */}
            <PublicationExcerpt onHeaderClick={null} fields={fields} />
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { filter, subresourceId }) => ({
    fields: fromFields.getEditingFields(state, { filter, subresourceId }),
});

export default compose(connect(mapStateToProps))(
    // @ts-expect-error TS2345
    PublicationPreviewComponent,
);
