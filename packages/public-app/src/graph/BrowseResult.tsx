import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import classnames from 'classnames';
import { CircularProgress, Button } from '@mui/material';

import {
    facetActions,
    search as searchAction,
    sort as sortAction,
    loadMore as loadMoreAction,
} from '../search/reducer';
import { preLoadPublication as preLoadPublicationAction } from '@lodex/frontend-common/fields/reducer';
import { fromFields } from '@lodex/frontend-common/sharedSelectors';
import { fromSearch, fromDataset } from '../selectors';
import AdminOnlyAlert from '@lodex/frontend-common/components/AdminOnlyAlert';
import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import AppliedFacetList from '../search/AppliedSearchFacetList';
import FacetList from '../facet/FacetList';
import SearchResultList from '../search/SearchResultList';
import SearchResultSort from '../search/SearchResultSort';
import SearchResultHeader from '../search/SearchResultHeader';
import type { Field } from '@lodex/frontend-common/fields/types';
import DatasetSearchBar from '../dataset/DatasetSearchBar';
import type { State } from '../reducers';

const styles: Record<string, string> = stylesToClassname(
    {
        container: {
            margin: '0 auto',
        },
        header: {
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '15px',
            gap: '1rem',
        },
        content: {
            backgroundColor: 'var(--neutral-dark-very-light)',
            '@media (min-width: 992px)': {
                display: 'flex',
            },
        },
        results: {
            opacity: '1',
            transition: 'opacity 300ms ease-in-out',
            '@media (min-width: 992px)': {
                padding: '0rem calc(1rem + 12px)',
                minWidth: '600px',
                flex: 3,
            },
        },
        resultsOpening: {
            opacity: '0',
        },
        loading: {
            marginRight: '1rem',
            marginTop: '-0.2rem',
        },
        loadMore: {
            height: 36,
            marginTop: '1rem',
        },
        noResult: {
            padding: '10% 0',
            textAlign: 'center',
        },
    },
    'search',
);

type SearchProps = {
    className?: string;
    search(...args: unknown[]): unknown;
    sort(...args: unknown[]): unknown;
    sortBy: string;
    sortDir: 'ASC' | 'DESC';
    preLoadPublication(...args: unknown[]): unknown;
    loading: boolean;
    results: {
        uri: string;
    }[];
    fieldNames: {
        uri?: string;
        title?: string;
        description?: string;
    };
    fields: Field[];
    loadMore(...args: unknown[]): unknown;
    total: number;
    closeDrawer(...args: unknown[]): unknown;
    setFacets(...args: unknown[]): unknown;
    searchTerm: string;
    facetsValues?: object;
    appliedFacets?: Record<string, string | number | boolean[]>;
    invertedFacets?: Record<string, string | number | boolean[]>;
    openedFacets?: Record<string, boolean>;
};

const BrowseResult = ({
    className,
    search,
    sort,
    sortBy,
    sortDir,
    preLoadPublication,
    loading,
    results,
    fieldNames,
    fields,
    loadMore,
    total,
    closeDrawer,
    setFacets,
    searchTerm,
    facetsValues,
    appliedFacets,
    invertedFacets,
    openedFacets,
}: SearchProps) => {
    const [opening, setOpening] = useState(true);

    const { translate } = useTranslate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpening(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setFacets({
            facetsValues,
            appliedFacets,
            invertedFacets,
            openedFacets,
        });
        preLoadPublication();
        search({ query: searchTerm || '' });
    }, [
        appliedFacets,
        facetsValues,
        invertedFacets,
        openedFacets,
        searchTerm,
        preLoadPublication,
        search,
        setFacets,
    ]);

    const handleSort = ({ sortBy }: { sortBy: string }) => {
        sort({ sortBy });
    };

    const renderNoResults = () => {
        return (
            <div className={styles.noResult}>
                <div>
                    <strong>{translate('no_result')}</strong>
                </div>
                <div>{translate('no_result_details')}</div>
            </div>
        );
    };

    const renderNoOverviewField = () => {
        return (
            <AdminOnlyAlert>
                {translate('no_overview_field_error')}
            </AdminOnlyAlert>
        );
    };

    const renderLoadMore = () => {
        return (
            <div className={classnames('load-more', styles.loadMore)}>
                {loading ? (
                    <>
                        <CircularProgress
                            variant="indeterminate"
                            size={20}
                            className={styles.loading}
                        />{' '}
                        {translate('loading')}
                    </>
                ) : (
                    <Button variant="text" fullWidth onClick={loadMore}>
                        {translate('search_load_more')} ({results.length} /{' '}
                        {total})
                    </Button>
                )}
            </div>
        );
    };

    const noOverviewField =
        !loading &&
        Object.values(fieldNames).filter(Boolean).length === 1 &&
        fieldNames.uri === 'uri';
    const noResults = !loading && !noOverviewField && results.length === 0;

    const everythingIsOk = !noOverviewField && !noResults;
    const canLoadMore = everythingIsOk && results.length < total;

    return (
        <div className={classnames(className, styles.container)}>
            <div className={styles.header}>
                <DatasetSearchBar />
            </div>
            <AppliedFacetList />
            <div className={styles.content}>
                <FacetList
                    className="search-facets"
                    page="search"
                    open={true}
                />
                <div
                    className={classnames(styles.results, {
                        [styles.resultsOpening]: opening,
                    })}
                >
                    {noOverviewField && renderNoOverviewField()}
                    {noResults && renderNoResults()}
                    {(everythingIsOk || loading) && (
                        <>
                            <SearchResultHeader
                                displayStats={everythingIsOk || noResults}
                                sortComponent={
                                    <SearchResultSort
                                        fields={fields}
                                        fieldNames={fieldNames}
                                        sort={handleSort}
                                        sortBy={sortBy}
                                        sortDir={sortDir}
                                    />
                                }
                            />
                            <SearchResultList
                                results={results}
                                fields={fields}
                                fieldNames={fieldNames}
                                closeDrawer={closeDrawer}
                                placeholders={loading}
                            />
                        </>
                    )}
                    {canLoadMore && renderLoadMore()}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: State) => {
    const { sortBy, sortDir } = fromSearch.getSort(state);

    return {
        loading: fromSearch.isLoading(state),
        results: fromSearch.getDataset(state),
        fieldNames: fromSearch.getFieldNames(state),
        fields: fromFields.getFields(state),
        total: fromSearch.getTotal(state),
        sortBy,
        sortDir,
        searchTerm: fromDataset.getFilter(state),
        facetsValues: fromDataset.getFacetsValues(state),
        appliedFacets: fromDataset.getAppliedFacets(state),
        invertedFacets: fromDataset.getInvertedFacets(state),
        openedFacets: fromDataset.getOpenedFacets(state),
    };
};

const mapDispatchToProps = {
    search: searchAction,
    sort: sortAction,
    preLoadPublication: preLoadPublicationAction,
    loadMore: loadMoreAction,
    setFacets: facetActions.setFacets,
};

export default compose<
    SearchProps,
    Omit<
        SearchProps,
        | 'search'
        | 'sort'
        | 'preLoadPublication'
        | 'loadMore'
        | 'setFacets'
        | 'loading'
        | 'results'
        | 'fieldNames'
        | 'fields'
        | 'total'
        | 'sortBy'
        | 'sortDir'
        | 'searchTerm'
        | 'facetsValues'
        | 'appliedFacets'
        | 'invertedFacets'
        | 'openedFacets'
    >
>(connect(mapStateToProps, mapDispatchToProps))(BrowseResult);
