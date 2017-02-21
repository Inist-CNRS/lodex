import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { grey400 } from 'material-ui/styles/colors';
import Card from '../../lib/Card';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    clearParsing,
} from './';
import {
    fromParsing,
} from '../selectors';
import ParsingExcerpt from './ParsingExcerpt';
import ParsingSummary from './ParsingSummary';

const styles = {
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
    parsingContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    parsingRightSection: {
        flexGrow: 2,
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
    constructor() {
        super();
        this.state = {
            showErrors: false,
        };
    }

    handleShowExcerpt = () => {
        this.setState({ showErrors: false });
    }

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
        const { showErrors } = this.state;

        return (
            <Card className="parsingResult" initiallyExpanded>
                <CardHeader
                    showExpandableButton
                    title={polyglot.t('Parsing summary')}
                    titleStyle={styles.title}
                >
                    <FlatButton
                        style={styles.button}
                        onClick={this.handleClearParsing}
                        label={polyglot.t('Upload another file')}
                    />
                </CardHeader>
                <CardText style={styles.parsingContainer} expandable>
                    <ParsingSummary
                        onShowExcerpt={this.handleShowExcerpt}
                        showErrors={showErrors}
                        totalLoadedLines={totalLoadedLines}
                    />
                    <div style={styles.parsingRightSection}>
                        {!showErrors &&
                            <ParsingExcerpt
                                columns={excerptColumns}
                                lines={excerptLines}
                            />
                        }
                    </div>
                </CardText>
            </Card>
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
    handleClearParsing: clearParsing,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ParsingResultComponent);
