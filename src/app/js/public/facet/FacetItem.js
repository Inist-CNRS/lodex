import React from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import getFieldClassName from '../../lib/getFieldClassName';
import { field as fieldPropType } from '../../propTypes';
import FacetValueList from './FacetValueList';

const styles = {
    nested: {
        padding: '0px 0px 8px',
    },
};

const FacetItem = ({ onClick, isOpen, field, total, ...rest }) => (
    <ListItem
        className={`facet-item facet-${getFieldClassName(field)}`}
        nestedListStyle={styles.nested}
        key={field.name}
        primaryText={`${field.label} ${total ? `(${total})` : ''}`}
        onClick={onClick}
        onNestedListToggle={onClick}
        open={isOpen}
        nestedItems={[
            <FacetValueList
                key="list"
                name={field.name}
                label={field.label}
                {...rest}
            />,
        ]}
    />
);

FacetItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    field: fieldPropType.isRequired,
    total: PropTypes.number,
};

const mapStateToProps = (
    state,
    { field, isFacetOpen, getFacetValuesTotal },
) => ({
    isOpen: isFacetOpen(state, field.name),
    total: getFacetValuesTotal(state, field.name),
});

const mapDispatchToProps = (dispatch, { openFacet }) => ({
    openFacet: (...args) => dispatch(openFacet(...args)),
});

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    withHandlers({
        onClick: ({ openFacet, field: { name } }) => () => openFacet({ name }),
    }),
)(FacetItem);
