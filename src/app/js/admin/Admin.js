import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import { loadParsingResult as loadParsingResultAction } from './parsing';
import ParsingResult from './parsing/ParsingResult';

export class AdminComponent extends Component {
    static propTypes = {
        loadParsingResult: PropTypes.func.isRequired,
        loadingParsingResult: PropTypes.bool.isRequired,
    }

    componentWillMount() {
        this.props.loadParsingResult();
    }

    render() {
        const {
            loadingParsingResult,
        } = this.props;

        if (loadingParsingResult) {
            return (
                <CircularProgress size={80} thickness={5} />
            );
        }

        return (
            <div>
                <ParsingResult />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loadingParsingResult: state.parsing.loading,
});

const mapDispatchToProps = ({
    loadParsingResult: loadParsingResultAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminComponent);
