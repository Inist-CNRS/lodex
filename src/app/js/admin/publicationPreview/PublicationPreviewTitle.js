import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import CircularProgress from 'material-ui/CircularProgress';
import memoize from 'lodash.memoize';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromPublicationPreview } from '../selectors';

const styles = {
    progress: memoize(isComputing => ({
        visibility: isComputing ? 'visible' : 'hidden',
    })),
};

export const PublicationPreviewTitleComponent = ({ isComputing, p: polyglot }) => (
    <div>
        {polyglot.t('publication_preview')}
        <CircularProgress
            className="publication-preview-is-computing"
            style={styles.progress(isComputing)}
            size={20}
        />
    </div>
);

PublicationPreviewTitleComponent.propTypes = {
    isComputing: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    isComputing: fromPublicationPreview.isComputing(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(PublicationPreviewTitleComponent);

