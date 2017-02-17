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
    getParsedExcerptColumns,
    getExcerptLines,
    isParsingLoading,
    getTotalLoadedLines,
    clearParsing,
} from './';
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

    render() {
        const {
            excerptColumns,
            excerptLines,
            totalLoadedLines,
            handleClearParsing,
            p: polyglot,
        } = this.props;
        const { showErrors } = this.state;

        return (
            <Card className="parsingResult" initiallyExpanded>
                <CardHeader
                    actAsExpander
                    showExpandableButton
                    title={polyglot.t('Parsing summary')}
                />
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
                <CardActions>
                    <FlatButton onClick={handleClearParsing} label={polyglot.t('Upload another file')} />
                </CardActions>
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
    excerptColumns: getParsedExcerptColumns(state),
    excerptLines: getExcerptLines(state),
    loadingParsingResult: isParsingLoading(state),
    totalLoadedLines: getTotalLoadedLines(state),
});

const mapDispatchToProps = {
    handleClearParsing: clearParsing,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ParsingResultComponent);
