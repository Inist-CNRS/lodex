import React from 'react';
import PropTypes from 'prop-types';
import withHandlers from 'recompose/withHandlers';
import Chip from 'material-ui/Chip';
import { facet as facetPropTypes } from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';

export const AppliedFacetComponent = ({
    facet: { field, value },
    handleRequestDelete,
}) => (
    <Chip
        className={`applied-facet-${getFieldClassName(field)}`}
        onRequestDelete={handleRequestDelete}
    >
        <b>{field.label}</b> {value}
    </Chip>
);

AppliedFacetComponent.propTypes = {
    facet: facetPropTypes.isRequired,
    handleRequestDelete: PropTypes.func.isRequired,
};

export default withHandlers({
    handleRequestDelete: ({ facet: { field }, onRemove }) => () =>
        onRemove(field),
})(AppliedFacetComponent);
