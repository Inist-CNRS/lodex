import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import TextField from 'material-ui/TextField';
import CheckBox from 'material-ui/Checkbox';

import {
    facetValue as facetValuePropType,
    polyglot as polyglotPropType,
} from '../../propTypes';
import { fromFacet } from '../selectors';
import FacetValueItem from './FacetValueItem';
import Pagination from '../../lib/components/Pagination';
import SortButton from '../../lib/components/SortButton';
import FacetActionsContext from './FacetActionsContext';

const styles = {
    listHeader: {
        display: 'flex',
    },
    valueHeader: {
        marginLeft: '24px',
    },
    totalHeader: {
        marginLeft: 'auto',
    },
};

const onPageChange = (changeFacetValue, filter, name) => (
    currentPage,
    perPage,
) =>
    changeFacetValue({
        name,
        currentPage,
        perPage,
        filter,
    });

const onFilterChange = (changeFacetValue, name, currentPage, perPage) => (
    _,
    filter,
) =>
    changeFacetValue({
        name,
        currentPage,
        perPage,
        filter,
    });

const onInvertChange = (invertFacet, name) => (_, inverted) =>
    invertFacet({ name, inverted });

const onSortChange = (sortFacetValue, name) => nextSortBy =>
    sortFacetValue({
        name,
        nextSortBy,
    });

const FacetValueList = ({
    name,
    label,
    facetValues,
    total,
    currentPage,
    perPage,
    filter,
    inverted,
    sort,
    p: polyglot,
    page,
}) => (
    <FacetActionsContext.Consumer>
        {({ changeFacetValue, invertFacet, sortFacetValue }) => (
            <div className="facet-value-list">
                <CheckBox
                    label={polyglot.t('exclude')}
                    checked={inverted}
                    onCheck={onInvertChange(invertFacet, name)}
                />
                <TextField
                    hintText={polyglot.t('filter_value', { field: label })}
                    value={filter}
                    onChange={onFilterChange(
                        changeFacetValue,
                        name,
                        currentPage,
                        perPage,
                    )}
                />
                <div>
                    <div style={styles.listHeader}>
                        <div style={styles.valueHeader}>
                            <SortButton
                                name="value"
                                label={polyglot.t('value')}
                                sortDir={sort.sortDir}
                                sortBy={sort.sortBy}
                                sort={onSortChange(sortFacetValue, name)}
                            />
                        </div>
                        <div style={styles.totalHeader}>
                            <SortButton
                                name="count"
                                label={polyglot.t('count')}
                                sortDir={sort.sortDir}
                                sortBy={sort.sortBy}
                                sort={onSortChange}
                            />
                        </div>
                    </div>
                    <div>
                        {facetValues.map(({ value, count }) => (
                            <FacetValueItem
                                key={value}
                                name={name}
                                value={value}
                                count={count}
                                page={page}
                            />
                        ))}
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
        )}
    </FacetActionsContext.Consumer>
);

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
};

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
)(FacetValueList);
