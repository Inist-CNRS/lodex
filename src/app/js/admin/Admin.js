import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import { loadParsingResult as loadParsingResultAction } from './parsing';
import ParsingResult from './parsing/ParsingResult';

class AdminComponent extends Component {
    static propTypes = {
        loadParsingResult: PropTypes.func.isRequired,
        loadingParsingResult: PropTypes.bool.isRequired,
        failedLines: PropTypes.array.isRequired,
        totalLoadedLines: PropTypes.number.isRequired,
        totalParsedLines: PropTypes.number.isRequired,
    }

    componentWillMount() {
        this.props.loadParsingResult();
    }

    render() {
        const {
            loadingParsingResult,
            failedLines,
            totalLoadedLines,
            totalParsedLines,
        } = this.props;

        if (loadingParsingResult) {
            return (
                <CircularProgress size={80} thickness={5} />
            );
        }

        return (
            <ParsingResult
                failedLines={failedLines}
                totalLoadedLines={totalLoadedLines}
                totalParsedLines={totalParsedLines}
            />
        );
    }
}

const mapStateToProps = state => ({
    failedLines: state.parsing.failedLines,
    loadingParsingResult: state.parsing.loading,
    totalLoadedLines: state.parsing.totalLoadedLines,
    totalParsedLines: state.parsing.totalParsedLines,
});

const mapDispatchToProps = ({
    loadParsingResult: loadParsingResultAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminComponent);
