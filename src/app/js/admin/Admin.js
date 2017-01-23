import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import { loadParsingResult as loadParsingResultAction, getParsedExcerptColumns } from './parsing';
import ParsingResult from './parsing/ParsingResult';

export class AdminComponent extends Component {
    static propTypes = {
        excerptColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
        excerptLines: PropTypes.arrayOf(PropTypes.object).isRequired,
        failedLines: PropTypes.arrayOf(PropTypes.string).isRequired,
        loadParsingResult: PropTypes.func.isRequired,
        loadingParsingResult: PropTypes.bool.isRequired,
        totalLoadedLines: PropTypes.number.isRequired,
        totalParsedLines: PropTypes.number.isRequired,
    }

    componentWillMount() {
        this.props.loadParsingResult();
    }

    render() {
        const {
            excerptColumns,
            excerptLines,
            failedLines,
            loadingParsingResult,
            totalLoadedLines,
            totalParsedLines,
        } = this.props;

        if (loadingParsingResult) {
            return (
                <CircularProgress size={80} thickness={5} />
            );
        }

        return (
            <div>
                <ParsingResult
                    excerptColumns={excerptColumns}
                    excerptLines={excerptLines}
                    failedLines={failedLines}
                    totalLoadedLines={totalLoadedLines}
                    totalParsedLines={totalParsedLines}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    excerptColumns: getParsedExcerptColumns(state),
    excerptLines: state.parsing.excerptLines,
    failedLines: state.parsing.failedLines,
    loadingParsingResult: state.parsing.loading,
    totalLoadedLines: state.parsing.totalLoadedLines,
    totalParsedLines: state.parsing.totalParsedLines,
});

const mapDispatchToProps = ({
    loadParsingResult: loadParsingResultAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminComponent);
