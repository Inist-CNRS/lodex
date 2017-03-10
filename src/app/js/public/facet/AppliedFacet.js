import React, { PropTypes } from 'react';
import withHandlers from 'recompose/withHandlers';
import Chip from 'material-ui/Chip';
import { facet as facetPropTypes } from '../../propTypes';

export const AppliedFacetComponent = ({ facet: { field, value }, handleRequestDelete }) => (
    <Chip onRequestDelete={handleRequestDelete}>
        <b>{field.label}</b>{' '}{value}
    </Chip>
);

AppliedFacetComponent.propTypes = {
    facet: facetPropTypes.isRequired,
    handleRequestDelete: PropTypes.func.isRequired,
};

export default withHandlers({
    handleRequestDelete: ({ facet: { field }, onRemove }) => () => onRemove(field),
})(AppliedFacetComponent);
