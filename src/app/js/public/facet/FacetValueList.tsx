import { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from '../../i18n/I18NContext';
import compose from 'recompose/compose';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import {
    facetValue as facetValuePropType,
    polyglot as polyglotPropType,
} from '../../propTypes';

import { fromFacet } from '../selectors';
import FacetValueItem from './FacetValueItem';
import Pagination from '../../lib/components/Pagination';
import SortButton from '../../lib/components/SortButton';
import FacetActionsContext from './FacetActionsContext';
import FacetValueAll from './FacetValueAll';

const DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;
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
    changeFacetValue: any,
    name: any,
    perPage: any,
    initialFilter: any,
) => {
    const [localFilter, setLocalFilter] = useState(initialFilter);
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        setLocalFilter(initialFilter);
    }, [initialFilter]);

    const performSearch = useCallback(
        (filterValue) => {
            if (abortControllerRef.current) {
                // @ts-expect-error TS2339
                abortControllerRef.current.abort();
            }

            const trimmedValue = filterValue.trim();
            if (
                trimmedValue.length > 0 &&
                trimmedValue.length < MIN_SEARCH_LENGTH
            ) {
                setIsSearching(false);
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
        (filterValue) => {
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
        (e) => {
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

export const FacetValueList = ({
    // @ts-expect-error TS7031
    name,
    // @ts-expect-error TS7031
    label,
    // @ts-expect-error TS7031
    facetValues,
    // @ts-expect-error TS7031
    total,
    // @ts-expect-error TS7031
    currentPage,
    // @ts-expect-error TS7031
    perPage,
    // @ts-expect-error TS7031
    filter,
    // @ts-expect-error TS7031
    inverted,
    // @ts-expect-error TS7031
    sort,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    page,
    // @ts-expect-error TS7031
    changeFacetValue,
    // @ts-expect-error TS7031
    invertFacet,
    // @ts-expect-error TS7031
    sortFacetValue,
}) => {
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
                label={polyglot.t('exclude')}
            />
            <TextField
                placeholder={polyglot.t('filter_value', { field: label })}
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
                helperText={
                    localFilter &&
                    localFilter.length > 0 &&
                    localFilter.length < MIN_SEARCH_LENGTH
                        ? polyglot.t('minimum_2_characters')
                        : ''
                }
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
                            {polyglot.t('value')}
                        </SortButton>
                    </div>
                    <div style={styles.totalHeader}>
                        <SortButton
                            name="count"
                            sortDir={sort.sortDir}
                            sortBy={sort.sortBy}
                            sort={onSortChange(sortFacetValue, name)}
                        >
                            {polyglot.t('count')}
                        </SortButton>
                    </div>
                </div>
                <div>
                    {/*
                     // @ts-expect-error TS2322 */}
                    {filter && <FacetValueAll name={name} page={page} />}
                    {/*
                     // @ts-expect-error TS7006 */}
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

FacetValueList.propTypes = {
    facetValues: PropTypes.arrayOf(facetValuePropType).isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    filter: PropTypes.string,
    inverted: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    sort: PropTypes.shape({
        sortBy: PropTypes.string,
        sortDir: PropTypes.oneOf(['ASC', 'DESC']),
    }).isRequired,
    p: polyglotPropType,
    page: PropTypes.oneOf(['dataset', 'search']).isRequired,
    changeFacetValue: PropTypes.func.isRequired,
    invertFacet: PropTypes.func.isRequired,
    sortFacetValue: PropTypes.func.isRequired,
};

// @ts-expect-error TS7006
export const ConnectFacetValueList = (props) => (
    <FacetActionsContext.Consumer>
        {/*
         // @ts-expect-error TS2339 */}
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

export default compose(
    translate,
    connect(mapStateToProps),
)(ConnectFacetValueList);
