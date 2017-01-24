import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import { loadParsingResult as loadParsingResultAction, hasUploadedFile as selectHasUploadedFile } from './parsing';
import ParsingResult from './parsing/ParsingResult';
import Upload from './upload/Upload';

export class AdminComponent extends Component {
    static propTypes = {
        loadParsingResult: PropTypes.func.isRequired,
        loadingParsingResult: PropTypes.bool.isRequired,
        hasUploadedFile: PropTypes.bool.isRequired,
    }

    componentWillMount() {
        this.props.loadParsingResult();
    }

    render() {
        const {
            loadingParsingResult,
            hasUploadedFile,
        } = this.props;

        if (loadingParsingResult) {
            return (
                <CircularProgress size={80} thickness={5} />
            );
        }

        if (hasUploadedFile) {
            return (
                <div>
                    <ParsingResult />
                </div>
            );
        }

        return (
            <div>
                <Upload />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loadingParsingResult: state.parsing.loading,
    hasUploadedFile: selectHasUploadedFile(state),
});

const mapDispatchToProps = ({
    loadParsingResult: loadParsingResultAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminComponent);
