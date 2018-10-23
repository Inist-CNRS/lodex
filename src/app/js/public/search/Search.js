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
} from './reducer';
import { fromFields } from '../../sharedSelectors';
import SearchResult from './SearchResult';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';

const styles = StyleSheet.create({
    container: {
        margin: '0 auto',
        padding: '0 1rem',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 0',
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

    render() {
        const { query } = this.state;
        const { loading, fieldNames, results, total, p: polyglot } = this.props;

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
                <div className={cnames('search-header', styles.header)}>
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
                            value={query || ''}
                        />
                    </div>
                    <div
                        className={cnames(
                            'search-advanced-toggle',
                            styles.advancedSearchToggle,
                        )}
                    >
                        <a href="#">{polyglot.t('search_advanced')}</a>
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
    closeDrawer: PropTypes.func.isRequired,
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
