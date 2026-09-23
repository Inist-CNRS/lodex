import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import AppliedFacet from '../facet/AppliedFacet';
import { fromFields } from '@lodex/frontend-common/sharedSelectors';
import { fromDataset } from '../selectors';
import { facetActions } from './index';

// @ts-expect-error TS7006
const mapStateToProps = (state, { name }) => ({
    field: fromFields.getFieldByName(state, name),
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
    // @ts-expect-error TS2322
)(AppliedFacet);
