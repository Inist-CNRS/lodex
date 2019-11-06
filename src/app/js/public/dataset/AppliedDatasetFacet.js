import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import AppliedFacet from '../facet/AppliedFacet';
import { fromFields } from '../../sharedSelectors';
import { fromDataset } from '../selectors';
import { facetActions } from '.';

const mapStateToProps = (state, { name }) => ({
    field: fromFields.getFieldByName(state, name),
    inverted: fromDataset.isFacetValuesInverted(state, name),
});

const mapDispatchToProps = { onClearFacet: facetActions.clearFacet };

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    withHandlers({
        onRequestDelete: ({ name, onClearFacet }) => () => onClearFacet(name),
    }),
)(AppliedFacet);
