import React from 'react';
import classnames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';
import TextField from 'material-ui/TextField';

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

const Search = () => (
    <div className={cnames('search', styles.container)}>
        <div className={cnames('search-header', styles.header)}>
            <h2 className={css(styles.title)}>Revues</h2>
            <div className={cnames('search-bar', styles.searchBarContainer)}>
                <TextField hintText="🔍 search" fullWidth />
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

export default Search;
