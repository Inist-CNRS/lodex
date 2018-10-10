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
import {
    fromSearch,
    search as searchAction,
    loadMore as loadMoreAction,
} from './';
import { fromFields } from '../../sharedSelectors';
import SearchResult from './SearchResult';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';

const styles = StyleSheet.create({
    container: {
        width: 500,
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
    },
    searchBarContainer: {
        width: '100%',
    },
    advancedSearchToggle: {
        alignSelf: 'flex-end',
    },
    searchResults: {
        margin: '1.5rem 0',
    },
    loading: {
        marginRight: '1rem',
        marginTop: '-0.2rem',
    },
    loadMore: {
        marginTop: '1.5rem',
    },
});

const cnames = (name, ...classes) => classnames(name, ...classes.map(css));

class Search extends Component {
    state = {
        query: null,
    };

    componentWillMount() {
        this.props.preLoadPublication();
        this.props.search();
    }

    debouncedSearch = debounce(params => {
        this.props.search(params);
    }, 500);

    handleTextFieldChange = (_, query) => {
        this.debouncedSearch({ query });
        this.setState({ query });
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
        const { results, fields, fieldNames } = this.props;

        return results.map(result => (
            <SearchResult
                key={result.uri}
                fields={fields}
                fieldNames={fieldNames}
                result={result}
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
        const { loadMore, p: polyglot } = this.props;

        return (
            <div className={classnames('load-more', css(styles.loadMore))}>
                <FlatButton fullWidth onClick={loadMore}>
                    {polyglot.t('load_more')}
                </FlatButton>
            </div>
        );
    };

    render() {
        const { query } = this.state;
        const { loading, fieldNames, results, total, p: polyglot } = this.props;

        const noResults = !loading && results.length === 0;
        const noOverviewField =
            !loading &&
            Object.values(fieldNames).filter(Boolean).length === 1 &&
            fieldNames.uri === 'uri';

        const everythingIsOk = !noOverviewField && !noResults;
        const canLoadMore =
            !loading && everythingIsOk && results.length < total;

        return (
            <div className={cnames('search', styles.container)}>
                <div className={cnames('search-header', styles.header)}>
                    <h2 className={css(styles.title)}>
                        {polyglot.t('search_page_title')}
                    </h2>
                    <div
                        className={cnames(
                            'search-bar',
                            styles.searchBarContainer,
                        )}
                    >
                        <TextField
                            hintText="🔍 search"
                            fullWidth
                            onChange={this.handleTextFieldChange}
                            value={query || ''}
                        />
                    </div>
                    <div
                        className={cnames(
                            'search-advanced-toggle',
                            styles.advancedSearchToggle,
                        )}
                    >
                        <a href="#">Recherche avancée</a>
                    </div>
                </div>
                <div className={cnames('search-results', styles.searchResults)}>
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
};

const mapStateToProps = state => ({
    loading: fromSearch.isLoading(state),
    results: fromSearch.getDataset(state),
    fieldNames: fromSearch.getFieldNames(state),
    fields: fromFields.getFields(state),
    total: fromSearch.getTotal(state),
});

const mapDispatchToProps = {
    search: searchAction,
    preLoadPublication: preLoadPublicationAction,
    loadMore: loadMoreAction,
};

export default compose(translate, connect(mapStateToProps, mapDispatchToProps))(
    Search,
);
