import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'material-ui/List';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import { facetValue as facetValuePropType } from '../../propTypes';
import FacetValueItem from './FacetValueItem';
import Pagination from '../../lib/components/Pagination';
import { fromFacet } from '../selectors';
import { changePage } from './';

const PureFacetValueList = ({
    name,
    facetValues,
    total,
    page,
    perPage,
    onChange,
}) => (
    <List>
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
            currentPage={page}
            perPage={perPage}
            onChange={onChange}
        />
    </List>
);

PureFacetValueList.propTypes = {
    facetValues: PropTypes.arrayOf(facetValuePropType).isRequired,
    name: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { name }) => ({
    facetValues: fromFacet.getFacetValues(state, name),
    total: fromFacet.getFacetValuesTotal(state, name),
    page: fromFacet.getFacetValuesPage(state, name),
    perPage: fromFacet.getFacetValuesPerPage(state, name),
});

const mapDispatchtoProps = {
    changePage,
};

export default compose(
    connect(mapStateToProps, mapDispatchtoProps),
    withHandlers({
        onChange: ({ name, changePage }) => (currentPage, perPage) =>
            changePage({ name, currentPage, perPage }),
    }),
)(PureFacetValueList);
