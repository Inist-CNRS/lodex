import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import withHandlers from 'recompose/withHandlers';
import compose from 'recompose/compose';

import { facetActions } from '../dataset';
import { fromDataset } from '../selectors';

const styles = {
    container: {
        display: 'flex',
    },
    count: {
        alignSelf: 'flex-start',
        paddingTop: '5px',
    },
    listItem: {
        fontSize: '1.5rem',
    },
    innerDiv: {
        padding: '0 5px',
    },
};

const PureFacetValueItem = ({ value, count, isChecked, onCheck }) => (
    <ListItem
        className="facet-value-item"
        style={styles.listItem}
        innerDivStyle={styles.innerDiv}
        primaryText={
            <div style={styles.container}>
                <Checkbox label={value} checked={isChecked} onCheck={onCheck} />
                <span style={styles.count}>{count}</span>
            </div>
        }
    />
);

PureFacetValueItem.propTypes = {
    value: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    isChecked: PropTypes.bool.isRequired,
    onCheck: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { name, value, isFacetValuesChecked }) => ({
    isChecked: isFacetValuesChecked(state, { name, value }),
});

const mapDispatchToProps = (dispatch, { toggleFacetValue }) => ({
    toggleFacetValue: (...args) => dispatch(toggleFacetValue(...args)),
});

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    withHandlers({
        onCheck: ({ name, value, toggleFacetValue }) => () =>
            toggleFacetValue({ name, value }),
    }),
)(PureFacetValueItem);
