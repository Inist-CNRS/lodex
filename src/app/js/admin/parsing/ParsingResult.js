import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { CardHeader } from 'material-ui/Card';
import { grey400 } from 'material-ui/styles/colors';
import ScrollableCardContent from '../../lib/ScrollableCardContent';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { reloadParsingResult } from './';
import { fromParsing } from '../selectors';
import ParsingExcerpt from './ParsingExcerpt';

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
    },
    card: {
        marginTop: 0,
    },
    content: {
        overflow: 'auto',
        display: 'flex',
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
    titleContainer: {
        display: 'inline-block',
        writingMode: 'vertical-rl',
        textAlign: 'center',
        textTransform: 'uppercase',
        flex: '0 0 1vw',
    },
    title: {
        paddingRight: 0,
        verticalAlign: 'baseline',
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
            p: polyglot,
            showAddColumns,
        } = this.props;

        return (
            <div className="parsingResult" style={styles.container}>
                <CardHeader
                    style={styles.titleContainer}
                    textStyle={styles.title}
                    title={polyglot.t('parsing')}
                />

                <ScrollableCardContent style={styles.content}>
                    <ParsingExcerpt
                        columns={excerptColumns}
                        lines={excerptLines}
                        showAddColumns={showAddColumns}
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
    handleClearParsing: PropTypes.func.isRequired,
    showAddColumns: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    excerptColumns: fromParsing.getParsedExcerptColumns(state),
    excerptLines: fromParsing.getExcerptLines(state),
    loadingParsingResult: fromParsing.isParsingLoading(state),
    showAddColumns: fromParsing.showAddColumns(state),
});

const mapDispatchToProps = {
    handleClearParsing: reloadParsingResult,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ParsingResultComponent);
