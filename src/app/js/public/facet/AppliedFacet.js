import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import Chip from 'material-ui/Chip';

import { field as fieldPropTypes } from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';
import { fromFields } from '../../sharedSelectors';

const styles = {
    chip: {
        margin: 5,
    },
};

export const AppliedFacetComponent = ({
    value,
    field,
    handleRequestDelete,
}) => (
    <Chip
        style={styles.chip}
        className={`applied-facet-${getFieldClassName(field)}`}
        onRequestDelete={handleRequestDelete}
    >
        <b>{field.label}</b> {value}
    </Chip>
);

AppliedFacetComponent.propTypes = {
    value: PropTypes.string.isRequired,
    field: fieldPropTypes.isRequired,
    handleRequestDelete: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { name }) => ({
    field: fromFields.getFieldByName(state, name),
});

export default compose(
    connect(mapStateToProps),
    withHandlers({
        handleRequestDelete: ({ name, onRemove }) => () => onRemove(name),
    }),
)(AppliedFacetComponent);
