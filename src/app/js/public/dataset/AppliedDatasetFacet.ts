import { connect } from 'react-redux';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
// @ts-expect-error TS7016
import withHandlers from 'recompose/withHandlers';

import AppliedFacet from '../facet/AppliedFacet';
import { fromFields } from '../../sharedSelectors';
import { fromDataset } from '../selectors';
import { facetActions } from '.';

// @ts-expect-error TS7006
const mapStateToProps = (state, { name }) => ({
    // @ts-expect-error TS2339
    field: fromFields.getFieldByName(state, name),
    // @ts-expect-error TS2339
    inverted: fromDataset.isFacetValuesInverted(state, name),
});

const mapDispatchToProps = { onClearFacet: facetActions.clearFacet };

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        onRequestDelete:
            // @ts-expect-error TS7031
            ({ name, onClearFacet }) =>
            () =>
                onClearFacet(name),
    }),
)(AppliedFacet);
