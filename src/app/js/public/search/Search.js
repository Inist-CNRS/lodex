import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';
import debounce from 'lodash.debounce';

import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

import {
    polyglot as polyglotPropTypes,
    field as fieldProptypes,
    resource as resourcePropTypes,
} from '../../propTypes';
import { preLoadPublication as preLoadPublicationAction } from '../../fields';
import { search as searchAction, loadMore as loadMoreAction } from './reducer';
import { fromFields } from '../../sharedSelectors';
import { fromSearch } from '../selectors';
import SearchResult from './SearchResult';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import theme from '../../theme';

const styles = StyleSheet.create({
    container: {
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
    },
    searchBarContainer: {
        width: '100%',
    },
    advancedSearchToggle: {
        alignSelf: 'flex-end',
        cursor: 'pointer',
    },
    searchResults: {
        margin: '1.5rem 0',
        opacity: '1',
        transition: 'opacity 300ms ease-in-out',
    },
    searchResultsOpening: {
        opacity: '0',
    },
    searchResultsEmpty: {
        opacity: '0',
    },
    loading: {
        marginRight: '1rem',
        marginTop: '-0.2rem',
    },
    loadMore: {
        marginTop: '1.5rem',
    },
});

const muiStyles = {
    searchBarUnderline: {
        borderColor: theme.orange.primary,
    },
};

const cnames = (name, ...classes) => classnames(name, ...classes.map(css));

class Search extends Component {
    state = {
        bufferQuery: null,
        opening: true,
    };

    constructor(props) {
        super(props);
        this.textInput = React.createRef();
    }

    UNSAFE_componentWillMount() {
        const { searchQuery, search, preLoadPublication } = this.props;

        preLoadPublication();
        search({ query: searchQuery || '' });

        setTimeout(() => {
            this.setState({ opening: false });
            this.textInput.current.input.focus();
        }, 300);
    }

    debouncedSearch = debounce(params => {
        this.props.search(params);
    }, 500);

    handleTextFieldChange = (_, query) => {
        this.debouncedSearch({ query });
        this.setState({ bufferQuery: query });
    };

    renderLoading = () => {
        const { p: polyglot } = this.props;

        return (
            <div>
                <CircularProgress size={20} className={css(styles.loading)} />{' '}
                {polyglot.t('loading')}
            </div>
        );
    };

    renderResults = () => {
        const { results, fields, fieldNames, closeDrawer } = this.props;

        return results.map(result => (
            <SearchResult
                key={result.uri}
                fields={fields}
                fieldNames={fieldNames}
                result={result}
                closeDrawer={closeDrawer}
            />
        ));
    };

    renderNoResults = () => {
        const { p: polyglot } = this.props;

        return <p>{polyglot.t('no_result')}</p>;
    };

    renderNoOverviewField = () => {
        const { p: polyglot } = this.props;

        return (
            <AdminOnlyAlert>
                {polyglot.t('no_overview_field_error')}
            </AdminOnlyAlert>
        );
    };

    renderLoadMore = () => {
        const { loadMore, p: polyglot, results, total } = this.props;

        return (
            <div className={classnames('load-more', css(styles.loadMore))}>
                <FlatButton fullWidth onClick={loadMore}>
                    {polyglot.t('search_load_more')} ({total - results.length})
                </FlatButton>
            </div>
        );
    };

    handleAdvancedSearchClick = evt => {
        evt.preventDefault();
        this.props.toggleAdvancedSearch();
    };

    render() {
        const { bufferQuery, opening } = this.state;
        const {
            searchQuery,
            loading,
            fieldNames,
            results,
            total,
            p: polyglot,
            showAdvancedSearch,
        } = this.props;

        const noOverviewField =
            !loading &&
            Object.values(fieldNames).filter(Boolean).length === 1 &&
            fieldNames.uri === 'uri';
        const noResults = !loading && !noOverviewField && results.length === 0;

        const everythingIsOk = !noOverviewField && !noResults;
        const canLoadMore =
            !loading && everythingIsOk && results.length < total;

        return (
            <div className={cnames('search', styles.container)}>
                <div
                    className={classnames('search-header', css(styles.header))}
                >
                    <div
                        className={cnames(
                            'search-bar',
                            styles.searchBarContainer,
                        )}
                    >
                        <TextField
                            hintText={`🔍 ${polyglot.t('search_placeholder')}`}
                            fullWidth
                            onChange={this.handleTextFieldChange}
                            value={
                                (bufferQuery !== null
                                    ? bufferQuery
                                    : searchQuery) || ''
                            }
                            underlineStyle={muiStyles.searchBarUnderline}
                            underlineFocusStyle={muiStyles.searchBarUnderline}
                            ref={this.textInput}
                        />
                    </div>
                    {showAdvancedSearch && (
                        <div
                            className={cnames(
                                'search-advanced-toggle',
                                styles.advancedSearchToggle,
                            )}
                        >
                            <a onClick={this.handleAdvancedSearchClick}>
                                {polyglot.t('search_advanced')}
                            </a>
                        </div>
                    )}
                </div>
                <div
                    className={classnames(
                        'search-results',
                        css(styles.searchResults),
                        { [css(styles.searchResultsOpening)]: opening },
                    )}
                >
                    {noOverviewField && this.renderNoOverviewField()}
                    {noResults && this.renderNoResults()}
                    {everythingIsOk && this.renderResults()}
                    {loading && this.renderLoading()}
                    {canLoadMore && this.renderLoadMore()}
                </div>
            </div>
        );
    }
}

Search.propTypes = {
    search: PropTypes.func.isRequired,
    searchQuery: PropTypes.string,
    preLoadPublication: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    results: PropTypes.arrayOf(resourcePropTypes).isRequired,
    fieldNames: PropTypes.shape({
        uri: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
    fields: PropTypes.arrayOf(fieldProptypes).isRequired,
    loadMore: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    closeDrawer: PropTypes.func.isRequired,
    showAdvancedSearch: PropTypes.bool.isRequired,
    toggleAdvancedSearch: PropTypes.func.isRequired,
};

Search.defaultProps = {
    searchQuery: null,
};

const mapStateToProps = state => ({
    loading: fromSearch.isLoading(state),
    results: fromSearch.getDataset(state),
    fieldNames: fromSearch.getFieldNames(state),
    fields: fromFields.getFields(state),
    total: fromSearch.getTotal(state),
    searchQuery: fromSearch.getQuery(state),
});

const mapDispatchToProps = {
    search: searchAction,
    preLoadPublication: preLoadPublicationAction,
    loadMore: loadMoreAction,
};

export default compose(
    translate,
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
)(Search);
