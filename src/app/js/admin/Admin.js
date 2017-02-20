import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../propTypes';

import {
    loadParsingResult as loadParsingResultAction,
} from './parsing';
import {
    loadPublication as loadPublicationAction,
} from './publication';
import { fromParsing, fromPublication, fromUpload } from './';

import ParsingResult from './parsing/ParsingResult';
import PublicationPreview from './publicationPreview/PublicationPreview';
import Publish from './publish/Publish';
import Published from './publish/Published';
import RemovedResourceList from './removedResources/RemovedResourceList';
import Upload from './upload/Upload';
import Loading from '../lib/Loading';

export class AdminComponent extends Component {
    static propTypes = {
        loadParsingResult: PropTypes.func.isRequired,
        loadPublication: PropTypes.func.isRequired,
        loadingParsingResult: PropTypes.bool.isRequired,
        hasPublishedDataset: PropTypes.bool.isRequired,
        hasUploadedFile: PropTypes.bool.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    componentWillMount() {
        this.props.loadPublication();
        this.props.loadParsingResult();
    }

    render() {
        const {
            loadingParsingResult,
            hasPublishedDataset,
            hasUploadedFile,
            p: polyglot,
        } = this.props;

        if (loadingParsingResult) {
            return (
                <Loading className="admin">{polyglot.t('loading_parsing_results')}</Loading>
            );
        }

        if (hasPublishedDataset) {
            return (
                <div className="admin">
                    <Published />
                    <RemovedResourceList />
                </div>
            );
        }

        if (hasUploadedFile) {
            return (
                <div className="admin">
                    <ParsingResult />
                    <PublicationPreview />
                    <Publish />
                </div>
            );
        }

        return (
            <Upload className="admin" />
        );
    }
}

const mapStateToProps = state => ({
    loadingParsingResult: fromParsing.isParsingLoading(state) || fromUpload.isUploadPending(state),
    hasUploadedFile: fromParsing.hasUploadedFile(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

const mapDispatchToProps = ({
    loadParsingResult: loadParsingResultAction,
    loadPublication: loadPublicationAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(AdminComponent);
