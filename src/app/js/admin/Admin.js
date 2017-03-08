import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Tab, Tabs } from 'material-ui/Tabs';

import { polyglot as polyglotPropTypes } from '../propTypes';

import {
    loadParsingResult as loadParsingResultAction,
} from './parsing';
import {
    loadPublication as loadPublicationAction,
} from './publication';
import { fromParsing, fromPublication, fromUpload } from './selectors';
import ParsingResult from './parsing/ParsingResult';
import PublicationPreview from './publicationPreview/PublicationPreview';
import Publish from './publish/Publish';
import Published from './publish/Published';
import RemovedResourceList from './removedResources/RemovedResourceList';
import ContributedResourceList from './contributedResources/ContributedResourceList';
import Upload from './upload/Upload';
import Loading from '../lib/Loading';
import Card from '../lib/Card';


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
                <Card className="admin">
                    <Published />
                    <Tabs>
                        <Tab label={polyglot.t('contributed_resources')} className="contributed-tab" >
                            <ContributedResourceList />
                        </Tab>
                        <Tab label={polyglot.t('removed_resources')} className="removed-tab" >
                            <RemovedResourceList />
                        </Tab>
                    </Tabs>
                </Card>
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
