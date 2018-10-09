import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';
import debounce from 'lodash.debounce';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import Loading from '../../lib/components/Loading';

import { search as searchAction, fromSearch } from './';
import SearchResult from './SearchResult';

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
});

const cnames = (name, ...classes) => classnames(name, ...classes.map(css));

class Search extends Component {
    state = {
        query: null,
    };

    componentWillMount() {
        this.props.search();
    }

    debouncedSearch = debounce(params => {
        this.props.search(params);
    }, 500);

    handleTextFieldChange = (_, query) => {
        this.debouncedSearch({ query });
        this.setState({ query });
    };

    render() {
        const { query } = this.state;
        const { loading, p: polyglot } = this.props;

        if (loading) {
            return <Loading>{polyglot.t('loading')}</Loading>;
        }

        return (
            <div className={cnames('search', styles.container)}>
                <div className={cnames('search-header', styles.header)}>
                    <h2 className={css(styles.title)}>Revues</h2>
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
                    <SearchResult />
                </div>
            </div>
        );
    }
}

Search.propTypes = {
    loading: PropTypes.bool.isRequired,
    search: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    loading: fromSearch.isLoading(state),
});

const mapDispatchToProps = {
    search: searchAction,
};

export default compose(translate, connect(mapStateToProps, mapDispatchToProps))(
    Search,
);
