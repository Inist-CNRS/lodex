import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'material-ui/List';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import TextField from 'material-ui/TextField';

import {
    facetValue as facetValuePropType,
    polyglot as polyglotPropType,
} from '../../propTypes';
import FacetValueItem from './FacetValueItem';
import Pagination from '../../lib/components/Pagination';
import { fromFacet } from '../selectors';
import { changeFacetValue } from './';

const PureFacetValueList = ({
    name,
    label,
    facetValues,
    total,
    currentPage,
    perPage,
    onPageChange,
    onFilterChange,
    filter,
    p: polyglot,
}) => (
    <List>
        <TextField
            floatingLabelText={polyglot.t('filter_value', { field: label })}
            value={filter}
            onChange={onFilterChange}
        />
        {facetValues.map(({ value, count }) => (
            <FacetValueItem
                key={value}
                name={name}
                value={value}
                count={count}
            />
        ))}
        <Pagination
            total={total}
            currentPage={currentPage}
            perPage={perPage}
            onChange={onPageChange}
        />
    </List>
);

PureFacetValueList.propTypes = {
    facetValues: PropTypes.arrayOf(facetValuePropType).isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    filter: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    p: polyglotPropType,
};

const mapStateToProps = (state, { name }) => ({
    facetValues: fromFacet.getFacetValues(state, name),
    total: fromFacet.getFacetValuesTotal(state, name),
    currentPage: fromFacet.getFacetValuesPage(state, name),
    perPage: fromFacet.getFacetValuesPerPage(state, name),
    filter: fromFacet.getFacetValuesFilter(state, name),
});

const mapDispatchtoProps = {
    changeFacetValue,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchtoProps),
    withHandlers({
        onPageChange: ({ name, changeFacetValue }) => (currentPage, perPage) =>
            changeFacetValue({ name, currentPage, perPage }),
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
    }),
)(PureFacetValueList);
