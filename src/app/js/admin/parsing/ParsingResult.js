import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { grey400 } from 'material-ui/styles/colors';

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
        alignSelf: 'center',
        flexGrow: 0,
        flexShrink: 0,
        width: 50,
    },
    title: {
        textTransform: 'uppercase',
        transform: 'rotate(-90deg)',
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
    };

    render() {
        const {
            excerptColumns,
            excerptLines,
            p: polyglot,
            showAddColumns,
        } = this.props;

        return (
            <div className="parsingResult" style={styles.container}>
                <div style={styles.titleContainer}>
                    <div style={styles.title}>{polyglot.t('parsing')}</div>
                </div>

                <ParsingExcerpt
                    columns={excerptColumns}
                    lines={excerptLines}
                    showAddColumns={showAddColumns}
                />
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

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    ParsingResultComponent,
);
