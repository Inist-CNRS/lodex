import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'material-ui/List';
import { connect } from 'react-redux';

import { facetValue as facetValuePropType } from '../../propTypes';
import FacetValueItem from './FacetValueItem';

const PureFacetValueList = ({ facetValues }) => (
    <List>
        {facetValues.map(({ value, count }) => (
            <FacetValueItem key={value} value={value} count={count} />
        ))}
    </List>
);

PureFacetValueList.propTypes = {
    facetValues: PropTypes.arrayOf(facetValuePropType).isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchtoProps = {};

export default connect(mapStateToProps, mapDispatchtoProps)(PureFacetValueList);
