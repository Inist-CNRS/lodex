// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Card } from '@mui/material';

/**
 * @TODO: Remove this file
 * THis file is useless now but we keep it to reproduce features
 */

import withInitialData from './withInitialData';
import { fromParsing, fromPublication, fromUpload } from './selectors';
import ParsingResult from './parsing/ParsingResult';
import PublicationPreview from './preview/publication/PublicationPreview';
import Upload from './upload/Upload';
import Loading from '../lib/components/Loading';
import { preLoadLoaders } from './loader/';
import { useTranslate } from '../i18n/I18NContext';

const styles = {
    punchLine: {
        padding: '16px',
        textAlign: 'center',
        color: 'var(--info-main)',
    },
};

// @ts-expect-error TS7031
export const AdminComponent = ({ loadingParsingResult, canUploadFile }) => {
    const { translate } = useTranslate();
    if (loadingParsingResult) {
        return (
            // @ts-expect-error TS2322
            <Loading className="admin">
                {translate('loading_parsing_results')}
            </Loading>
        );
    }

    if (canUploadFile) {
        // @ts-expect-error TS2322
        return <Upload className="admin" />;
    }

    return (
        <Card className="admin">
            <ParsingResult />
            <PublicationPreview />
            {/*
             // @ts-expect-error TS2322 */}
            <div style={styles.punchLine}>{translate('publish-punchline')}</div>
        </Card>
    );
};

AdminComponent.propTypes = {
    loadingParsingResult: PropTypes.bool.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
    canUploadFile: PropTypes.bool.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    loadingParsingResult:
        fromParsing.isParsingLoading(state) ||
        fromUpload.isUploadPending(state),
    canUploadFile: fromParsing.canUpload(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

const mapDispatchToProps = {
    preLoadLoaders,
};

export default compose(
    withInitialData,
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
        componentWillMount() {
            // @ts-expect-error TS2571
            this.props.preLoadLoaders();
        },
    }),
    // @ts-expect-error TS2345
)(AdminComponent);
