import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../propTypes';
import withInitialData from './withInitialData';
import { fromParsing, fromPublication, fromUpload } from './selectors';
import ParsingResult from './parsing/ParsingResult';
import Published from './publish/Published';
import Upload from './upload/Upload';
import Loading from '../lib/components/Loading';
import Card from '../lib/components/Card';
import theme from '../theme';
import { preLoadLoaders } from './loader';
import UploadButton from './upload/UploadButton';

// To move outside appbar
import Settings from './Appbar/Settings';

const styles = {
    punchLine: {
        padding: '16px',
        textAlign: 'center',
        color: theme.purple.primary,
    },
};

export const DataComponent = ({
    loadingParsingResult,
    hasPublishedDataset,
    canUploadFile,
    p: polyglot,
}) => {
    if (loadingParsingResult) {
        return (
            <Loading className="data">
                {polyglot.t('loading_parsing_results')}
            </Loading>
        );
    }

    if (hasPublishedDataset) {
        return (
            <div className="data">
                <Card>
                    <UploadButton
                        label={polyglot.t('upload_additional_file')}
                    />
                    <Published />
                </Card>
            </div>
        );
    }

    if (canUploadFile) {
        return <Upload className="data" />;
    }

    return (
        <Card className="data">
            <Settings />
            <ParsingResult />
            <div style={styles.punchLine}>
                {polyglot.t('publish-punchline')}
            </div>
        </Card>
    );
};

DataComponent.propTypes = {
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
)(DataComponent);
