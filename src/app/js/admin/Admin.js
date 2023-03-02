import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Card } from '@mui/material';

/**
 * @TODO: Remove this file
 * THis file is useless now but we keep it to reproduce features
 */

import { polyglot as polyglotPropTypes } from '../propTypes';
import withInitialData from './withInitialData';
import { fromParsing, fromPublication, fromUpload } from './selectors';
import ParsingResult from './parsing/ParsingResult';
import PublicationPreview from './preview/publication/PublicationPreview';
import Upload from './upload/Upload';
import Loading from '../lib/components/Loading';
import colorsTheme from '../../custom/colorsTheme';
import { preLoadLoaders } from './loader/';

const styles = {
    punchLine: {
        padding: '16px',
        textAlign: 'center',
        color: colorsTheme.purple.primary,
    },
};

export const AdminComponent = ({
    loadingParsingResult,
    canUploadFile,
    p: polyglot,
}) => {
    if (loadingParsingResult) {
        return (
            <Loading className="admin">
                {polyglot.t('loading_parsing_results')}
            </Loading>
        );
    }

    if (canUploadFile) {
        return <Upload className="admin" />;
    }

    return (
        <Card className="admin">
            <ParsingResult />
            <PublicationPreview />
            <div style={styles.punchLine}>
                {polyglot.t('publish-punchline')}
            </div>
        </Card>
    );
};

AdminComponent.propTypes = {
    loadingParsingResult: PropTypes.bool.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
    canUploadFile: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
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
            this.props.preLoadLoaders();
        },
    }),
    translate,
)(AdminComponent);
