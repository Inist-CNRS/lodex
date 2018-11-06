import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import TextField from 'material-ui/TextField';
import CheckBox from 'material-ui/Checkbox';

import {
    facetValue as facetValuePropType,
    polyglot as polyglotPropType,
} from '../../propTypes';
import FacetValueItem from './FacetValueItem';
import Pagination from '../../lib/components/Pagination';
import { fromDataset } from '../selectors';
import { facetActions } from '../dataset';
import SortButton from '../../lib/components/SortButton';

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

const PureFacetValueList = ({
    name,
    label,
    facetValues,
    total,
    currentPage,
    perPage,
    onPageChange,
    onFilterChange,
    onInvertChange,
    onSortChange,
    filter,
    inverted,
    sort,
    p: polyglot,
}) => (
    <div className="facet-value-list">
        <CheckBox
            label={polyglot.t('exclude')}
            checked={inverted}
            onCheck={onInvertChange}
        />
        <TextField
            hintText={polyglot.t('filter_value', { field: label })}
            value={filter}
            onChange={onFilterChange}
        />
        <div>
            <div style={styles.listHeader}>
                <div style={styles.valueHeader}>
                    <SortButton
                        name="value"
                        label={polyglot.t('value')}
                        sortDir={sort.sortDir}
                        sortBy={sort.sortBy}
                        sort={onSortChange}
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
                    />
                ))}
            </div>
        </div>
        <Pagination
            column
            total={total}
            currentPage={currentPage}
            perPage={perPage}
            onChange={onPageChange}
        />
    </div>
);

PureFacetValueList.propTypes = {
    facetValues: PropTypes.arrayOf(facetValuePropType).isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    filter: PropTypes.string.isRequired,
    inverted: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onInvertChange: PropTypes.func.isRequired,
    onSortChange: PropTypes.func.isRequired,
    sort: PropTypes.shape({
        sortBy: PropTypes.string,
        sortDir: PropTypes.oneOf(['ASC', 'DESC']),
    }).isRequired,
    p: polyglotPropType,
};

const mapStateToProps = (state, { name }) => ({
    facetValues: fromDataset.getFacetValues(state, name),
    total: fromDataset.getFacetValuesTotal(state, name),
    currentPage: fromDataset.getFacetValuesPage(state, name),
    perPage: fromDataset.getFacetValuesPerPage(state, name),
    filter: fromDataset.getFacetValuesFilter(state, name),
    inverted: fromDataset.isFacetValuesInverted(state, name),
    sort: fromDataset.getFacetValuesSort(state, name),
});

const mapDispatchtoProps = {
    changeFacetValue: facetActions.changeFacetValue,
    invertFacet: facetActions.invertFacet,
    sortFacetValue: facetActions.sortFacetValue,
};

export default compose(
    translate,
    connect(
        mapStateToProps,
        mapDispatchtoProps,
    ),
    withHandlers({
        onPageChange: ({ name, filter, changeFacetValue }) => (
            currentPage,
            perPage,
        ) =>
            changeFacetValue({
                name,
                currentPage,
                perPage,
                filter,
            }),
        onFilterChange: ({ name, currentPage, perPage, changeFacetValue }) => (
            _,
            filter,
        ) =>
            changeFacetValue({
                name,
                currentPage,
                perPage,
                filter,
            }),
        onInvertChange: ({ name, invertFacet }) => (_, inverted) =>
            invertFacet({ name, inverted }),
        onSortChange: ({ name, sortFacetValue }) => nextSortBy =>
            sortFacetValue({
                name,
                nextSortBy,
            }),
    }),
)(PureFacetValueList);
