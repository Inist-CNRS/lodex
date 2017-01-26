import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import {
    loadParsingResult as loadParsingResultAction,
    hasUploadedFile as selectHasUploadedFile,
} from './parsing';
import {
    loadPublication as loadPublicationAction,
    hasPublishedDataset as selectHasPublishedDataset,
} from '../publication';
import ParsingResult from './parsing/ParsingResult';
import Publish from './publish/Publish';
import Published from '../publication/Published';
import Upload from './upload/Upload';

const styles = {
    container: {
        marginTop: '0.5rem',
    },
};

export class AdminComponent extends Component {
    static propTypes = {
        loadParsingResult: PropTypes.func.isRequired,
        loadPublication: PropTypes.func.isRequired,
        loadingParsingResult: PropTypes.bool.isRequired,
        hasPublishedDataset: PropTypes.bool.isRequired,
        hasUploadedFile: PropTypes.bool.isRequired,
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
        } = this.props;

        if (loadingParsingResult) {
            return (
                <CircularProgress size={80} thickness={5} />
            );
        }

        if (hasPublishedDataset) {
            return (
                <div>
                    <div style={styles.container}>
                        <Published />
                    </div>
                </div>
            );
        }

        if (hasUploadedFile) {
            return (
                <div>
                    <div style={styles.container}>
                        <ParsingResult />
                    </div>
                    <div style={styles.container}>
                        <Publish />
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div style={styles.container}>
                    <Upload />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loadingParsingResult: state.parsing.loading || state.upload.status === 'PENDING',
    hasUploadedFile: selectHasUploadedFile(state),
    hasPublishedDataset: selectHasPublishedDataset(state),
});

const mapDispatchToProps = ({
    loadParsingResult: loadParsingResultAction,
    loadPublication: loadPublicationAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminComponent);
