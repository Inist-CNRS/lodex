import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'material-ui/List';
import { connect } from 'react-redux';

import { facetValue as facetValuePropType } from '../../propTypes';
import FacetValueItem from './FacetValueItem';

const PureFacetValueList = ({ name, facetValues }) => (
    <List>
        {facetValues.map(({ value, count }) => (
            <FacetValueItem
                key={value}
                name={name}
                value={value}
                count={count}
            />
        ))}
    </List>
);

PureFacetValueList.propTypes = {
    facetValues: PropTypes.arrayOf(facetValuePropType).isRequired,
    name: PropTypes.string.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchtoProps = {};

export default connect(mapStateToProps, mapDispatchtoProps)(PureFacetValueList);
