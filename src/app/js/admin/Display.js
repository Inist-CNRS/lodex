import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../propTypes';
import withInitialData from './withInitialData';
import { fromParsing, fromPublication, fromUpload } from './selectors';
import ParsingResult from './parsing/ParsingResult';
import PublicationPreview from './preview/publication/PublicationPreview';
import Published from './publish/Published';
import Upload from './upload/Upload';
import Loading from '../lib/components/Loading';
import Card from '../lib/components/Card';
import Statistics from './Statistics';
import theme from '../theme';
import { preLoadLoaders } from './loader';
import ModelMenu from './Appbar/ModelMenu';

const styles = {
    punchLine: {
        padding: '16px',
        textAlign: 'center',
        color: theme.purple.primary,
    },
};

export const DisplayComponent = ({
    loadingParsingResult,
    hasPublishedDataset,
    canUploadFile,
    p: polyglot,
}) => {
    if (loadingParsingResult) {
        return (
            <Loading className="display">
                {polyglot.t('loading_parsing_results')}
            </Loading>
        );
    }

    if (hasPublishedDataset) {
        return (
            <div className="display">
                <Card>
                    <Published />
                </Card>
            </div>
        );
    }

    if (canUploadFile) {
        return <Upload className="display" />;
    }

    return (
        <Card className="display">
            <ModelMenu hasPublishedDataset={hasPublishedDataset} />
            <Statistics />
            <PublicationPreview />
        </Card>
    );
};

DisplayComponent.propTypes = {
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
)(DisplayComponent);
