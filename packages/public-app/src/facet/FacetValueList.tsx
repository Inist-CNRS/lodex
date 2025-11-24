import {
    useState,
    useCallback,
    useRef,
    useEffect,
    type ChangeEvent,
} from 'react';
import { connect } from 'react-redux';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import compose from 'recompose/compose';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    CircularProgress,
} from '@mui/material';

import { fromFacet } from '../selectors';
import FacetValueItem from './FacetValueItem';
import Pagination from '@lodex/frontend-common/components/Pagination';
import SortButton from '@lodex/frontend-common/components/SortButton';
import FacetActionsContext from './FacetActionsContext';
import FacetValueAll from './FacetValueAll';

const DEBOUNCE_DELAY = 300;
const LOADING_DELAY = 200;

const styles = {
    list: {
        padding: '1rem',
    },
    listHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    valueHeader: {
        marginLeft: '24px',
    },
    totalHeader: {
        marginLeft: 'auto',
    },
};

const onPageChange =
    // @ts-expect-error TS7006
    (changeFacetValue, filter, name) => (currentPage, perPage) =>
        changeFacetValue({
            name,
            currentPage,
            perPage,
            filter,
        });

/* Hook to manage the filter with debounce and cancellation */
export const useDebouncedSearch = (
    changeFacetValue: (facetValue: {
        name: string;
        currentPage: number;
        perPage: number;
        filter: string;
    }) => void,
    name: string,
    perPage: number,
    initialFilter: string,
) => {
    const [localFilter, setLocalFilter] = useState<string>(initialFilter);
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        setLocalFilter(initialFilter);
    }, [initialFilter]);

    const performSearch = useCallback(
        (filterValue: string) => {
            if (abortControllerRef.current) {
                // @ts-expect-error TS2339
                abortControllerRef.current.abort();
            }

            const trimmedValue = filterValue.trim();
            if (trimmedValue.length === 0) {
                setIsSearching(false);
                changeFacetValue({
                    name,
                    currentPage: 0,
                    perPage,
                    filter: filterValue,
                });
                return;
            }

            setIsSearching(true);
            // @ts-expect-error TS2322
            abortControllerRef.current = new AbortController();

            changeFacetValue({
                name,
                currentPage: 0,
                perPage,
                filter: filterValue,
            });

            setTimeout(() => {
                setIsSearching(false);
            }, LOADING_DELAY);
        },
        [changeFacetValue, name, perPage],
    );

    const debouncedSearch = useCallback(
        (filterValue: string) => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            // @ts-expect-error TS2322
            debounceTimeoutRef.current = setTimeout(() => {
                performSearch(filterValue);
            }, DEBOUNCE_DELAY);
        },
        [performSearch],
    );

    const handleFilterChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setLocalFilter(newValue);

            if (newValue === '') {
                if (debounceTimeoutRef.current) {
                    clearTimeout(debounceTimeoutRef.current);
                }
                performSearch(newValue);
            } else {
                debouncedSearch(newValue);
            }
        },
        [debouncedSearch, performSearch],
    );

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            if (abortControllerRef.current) {
                // @ts-expect-error TS2339
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        localFilter,
        isSearching,
        handleFilterChange,
    };
};

// @ts-expect-error TS7006
const onInvertChange = (invertFacet, name) => (_, inverted) =>
    invertFacet({ name, inverted });

// @ts-expect-error TS7006
const onSortChange = (sortFacetValue, name) => (nextSortBy) =>
    sortFacetValue({
        name,
        nextSortBy,
    });

interface FacetValueListProps {
    facetValues: { value: string }[];
    name: string;
    label: string;
    filter: string;
    inverted: boolean;
    total: number;
    currentPage: number;
    perPage: number;
    sort: {
        sortBy?: string;
        sortDir?: 'ASC' | 'DESC';
    };
    p?: unknown;
    page: 'dataset' | 'search';
    changeFacetValue(...args: unknown[]): unknown;
    invertFacet(...args: unknown[]): unknown;
    sortFacetValue(...args: unknown[]): unknown;
}

export const FacetValueList = ({
    name,
    label,
    facetValues,
    total,
    currentPage,
    perPage,
    filter,
    inverted,
    sort,
    page,
    changeFacetValue,
    invertFacet,
    sortFacetValue,
}: FacetValueListProps) => {
    const { translate } = useTranslate();
    const { localFilter, isSearching, handleFilterChange } = useDebouncedSearch(
        changeFacetValue,
        name,
        perPage,
        filter,
    );

    return (
        <div className="facet-value-list" style={styles.list}>
            <FormControlLabel
                // @ts-expect-error TS2322
                fullWidth
                control={
                    <Checkbox
                        checked={inverted}
                        onChange={onInvertChange(invertFacet, name)}
                        className="exclude-facet"
                    />
                }
                label={translate('exclude')}
            />
            <TextField
                placeholder={translate('filter_value', { field: label })}
                value={localFilter}
                fullWidth
                onChange={handleFilterChange}
                variant="standard"
                InputProps={{
                    endAdornment: isSearching && (
                        <InputAdornment position="end">
                            <CircularProgress size={16} />
                        </InputAdornment>
                    ),
                }}
                helperText={''}
            />
            <div>
                <div style={styles.listHeader}>
                    <div style={styles.valueHeader}>
                        <SortButton
                            name="value"
                            sortDir={sort.sortDir}
                            sortBy={sort.sortBy}
                            sort={onSortChange(sortFacetValue, name)}
                        >
                            {translate('value')}
                        </SortButton>
                    </div>
                    <div style={styles.totalHeader}>
                        <SortButton
                            name="count"
                            sortDir={sort.sortDir}
                            sortBy={sort.sortBy}
                            sort={onSortChange(sortFacetValue, name)}
                        >
                            {translate('count')}
                        </SortButton>
                    </div>
                </div>
                <div>
                    {/* @ts-expect-error - legacy typing issue */}
                    {filter && <FacetValueAll name={name} page={page} />}
                    {facetValues.map((facetValue) => {
                        return (
                            <FacetValueItem
                                key={facetValue.value}
                                // @ts-expect-error TS2322
                                name={name}
                                facetValue={facetValue}
                                page={page}
                            />
                        );
                    })}
                </div>
            </div>
            <Pagination
                column
                total={total}
                currentPage={currentPage}
                perPage={perPage}
                onChange={onPageChange(changeFacetValue, filter, name)}
            />
        </div>
    );
};

// @ts-expect-error TS7006
export const ConnectFacetValueList = (props) => (
    <FacetActionsContext.Consumer>
        {/* @ts-expect-error - legacy typing issue */}
        {({ changeFacetValue, invertFacet, sortFacetValue }) => (
            <FacetValueList
                {...props}
                changeFacetValue={changeFacetValue}
                invertFacet={invertFacet}
                sortFacetValue={sortFacetValue}
            />
        )}
    </FacetActionsContext.Consumer>
);

// @ts-expect-error TS7006
const mapStateToProps = (state, { name, page }) => {
    const selectors = fromFacet(page);

    return {
        facetValues: selectors.getFacetValues(state, name),
        total: selectors.getFacetValuesTotal(state, name),
        currentPage: selectors.getFacetValuesPage(state, name),
        perPage: selectors.getFacetValuesPerPage(state, name),
        filter: selectors.getFacetValuesFilter(state, name),
        inverted: selectors.isFacetValuesInverted(state, name),
        sort: selectors.getFacetValuesSort(state, name),
    };
};

export default compose(connect(mapStateToProps))(ConnectFacetValueList);
