import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import Chip from 'material-ui/Chip';

import { field as fieldPropTypes } from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';
import { fromFields } from '../../sharedSelectors';
import { clearFacet } from './index';

const styles = {
    chip: {
        margin: 5,
    },
};

export const AppliedFacetComponent = ({ value, field, onRequestDelete }) => (
    <Chip
        style={styles.chip}
        className={`applied-facet-${getFieldClassName(field)}`}
        onRequestDelete={onRequestDelete}
    >
        <b>{field.label}</b> {value.join(' | ')}
    </Chip>
);

AppliedFacetComponent.propTypes = {
    value: PropTypes.string.isRequired,
    field: fieldPropTypes.isRequired,
    onRequestDelete: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { name }) => ({
    field: fromFields.getFieldByName(state, name),
});

const mapDispatchToProps = { onClearFacet: clearFacet };

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        onRequestDelete: ({ name, onClearFacet }) => () => onClearFacet(name),
    }),
)(AppliedFacetComponent);
