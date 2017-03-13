import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { grey400 } from 'material-ui/styles/colors';
import ScrollableCardContent from '../../lib/ScrollableCardContent';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    reloadParsingResult,
} from './';
import {
    fromParsing,
} from '../selectors';
import ParsingExcerpt from './ParsingExcerpt';

const styles = {
    container: {
        position: 'relative',
    },
    list: {
        borderRight: `solid 1px ${grey400}`,
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        paddingRight: '1rem',
    },
    listItem: {
        whiteSpace: 'nowrap',
    },
    title: {
        height: '36px',
        lineHeight: '36px',
    },
    button: {
        float: 'right',
        marginRight: '2rem',
    },
};

export class ParsingResultComponent extends Component {
    handleClearParsing = () => {
        event.preventDefault();
        event.stopPropagation();
        this.props.handleClearParsing();
    }

    render() {
        const {
            excerptColumns,
            excerptLines,
            totalLoadedLines,
            p: polyglot,
        } = this.props;

        return (
            <div className="parsingResult" style={styles.container}>
                <CardHeader
                    showExpandableButton
                    title={polyglot.t('parsing_summary', { count: totalLoadedLines })}
                    titleStyle={styles.title}
                >
                    <FlatButton
                        style={styles.button}
                        onClick={this.handleClearParsing}
                        label={polyglot.t('Upload another file')}
                        primary
                    />
                </CardHeader>
                <ScrollableCardContent>
                    <ParsingExcerpt
                        columns={excerptColumns}
                        lines={excerptLines}
                    />
                </ScrollableCardContent>
            </div>
        );
    }
}

ParsingResultComponent.propTypes = {
    excerptColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    excerptLines: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
    handleClearParsing: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    excerptColumns: fromParsing.getParsedExcerptColumns(state),
    excerptLines: fromParsing.getExcerptLines(state),
    loadingParsingResult: fromParsing.isParsingLoading(state),
    totalLoadedLines: fromParsing.getTotalLoadedLines(state),
});

const mapDispatchToProps = {
    handleClearParsing: reloadParsingResult,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ParsingResultComponent);
