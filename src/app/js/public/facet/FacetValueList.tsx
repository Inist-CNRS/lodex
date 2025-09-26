// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from '../../i18n/I18NContext';
import compose from 'recompose/compose';
import { TextField, Checkbox, FormControlLabel } from '@mui/material';

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

// @ts-expect-error TS7006
const onFilterChange = (changeFacetValue, name, perPage) => (e) => {
    changeFacetValue({
        name,
        currentPage: 0,
        perPage,
        filter: e.target.value,
    });
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
                value={filter}
                fullWidth
                onChange={onFilterChange(changeFacetValue, name, perPage)}
                variant="standard"
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
    filter: PropTypes.string.isRequired,
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
