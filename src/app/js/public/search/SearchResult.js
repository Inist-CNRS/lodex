import React from 'react';
import classnames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem 0',
        borderTop: '2px solid black',
    },
    row: {
        flex: '0 0 auto',
    },
    title: {
        flex: '0 0 auto',
        fontSize: 'medium',
        fontWeight: 'bold',
        marginBottom: '.75rem',
    },
    description: {
        flex: '0 0 auto',
        marginBottom: '.75rem',
        textAlign: 'justify',
    },
    details: {
        display: 'flex',
        flex: '0 0 auto',
        fontSize: 'smaller',
    },
    detailsColumn: {
        flex: '1 0 0',
        paddingRight: '1rem',
        textAlign: 'justify',
    },
});

const cnames = (name, ...classes) => classnames(name, ...classes.map(css));

const SearchResult = () => (
    <div className={cnames('search-result', styles.container)}>
        <div className={cnames('search-result-title', styles.title)}>
            European Journal of Epidemiology
        </div>
        <div
            className={cnames('search-result-description', styles.description)}
        >
            2011-2014
        </div>
        <div className={cnames('search-result-details', styles.details)}>
            <div
                className={cnames(
                    'search-result-detail1',
                    styles.detailsColumn,
                )}
            >
                BMJ
            </div>
            <div
                className={cnames(
                    'search-result-detail2',
                    styles.detailsColumn,
                )}
            >
                0393-2990
            </div>
        </div>
    </div>
);

export default SearchResult;
