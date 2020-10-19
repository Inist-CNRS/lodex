import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Card } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../propTypes';
import withInitialData from './withInitialData';
import { fromParsing, fromPublication, fromUpload } from './selectors';
import ParsingResult from './parsing/ParsingResult';
import PublicationPreview from './preview/publication/PublicationPreview';
import Published from './publish/Published';
import Upload from './upload/Upload';
import Loading from '../lib/components/Loading';
import Statistics from './Statistics';
import theme from '../theme';
import { preLoadLoaders } from './loader/';

const styles = {
    punchLine: {
        padding: '16px',
        textAlign: 'center',
        color: theme.purple.primary,
    },
};

export const AdminComponent = ({
    loadingParsingResult,
    hasPublishedDataset,
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

    if (hasPublishedDataset) {
        return (
            <div className="admin">
                <Card style={{ marginTop: '0.5rem' }}>
                    <Published />
                </Card>
            </div>
        );
    }

    if (canUploadFile) {
        return <Upload className="admin" />;
    }

    return (
        <Card className="admin">
            <ParsingResult />
            <Statistics />
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
