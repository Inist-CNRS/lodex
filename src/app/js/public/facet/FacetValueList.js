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
import { fromFacet } from '../selectors';
import { changeFacetValue, invertFacet } from './';

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
    filter,
    inverted,
    p: polyglot,
}) => (
    <div>
        <CheckBox
            label={polyglot.t('exlude')}
            checked={inverted}
            onCheck={onInvertChange}
        />
        <TextField
            hintText={polyglot.t('filter_value', { field: label })}
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
    p: polyglotPropType,
};

const mapStateToProps = (state, { name }) => ({
    facetValues: fromFacet.getFacetValues(state, name),
    total: fromFacet.getFacetValuesTotal(state, name),
    currentPage: fromFacet.getFacetValuesPage(state, name),
    perPage: fromFacet.getFacetValuesPerPage(state, name),
    filter: fromFacet.getFacetValuesFilter(state, name),
    inverted: fromFacet.isFacetValuesInverted(state, name),
});

const mapDispatchtoProps = {
    changeFacetValue,
    invertFacet,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchtoProps),
    withHandlers({
        onPageChange: ({ name, filter, inverted, changeFacetValue }) => (
            currentPage,
            perPage,
        ) => changeFacetValue({ name, currentPage, perPage, filter, inverted }),
        onFilterChange: ({
            name,
            currentPage,
            perPage,
            inverted,
            changeFacetValue,
        }) => (_, filter) =>
            changeFacetValue({
                name,
                currentPage,
                perPage,
                inverted,
                filter,
            }),
        onInvertChange: ({ name, invertFacet }) => (_, inverted) =>
            invertFacet({ name, inverted }),
    }),
)(PureFacetValueList);
