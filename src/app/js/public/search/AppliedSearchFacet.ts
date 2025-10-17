import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import AppliedFacet from '../facet/AppliedFacet';
import { fromFields } from '../../sharedSelectors';
import { fromSearch } from '../selectors';
import { facetActions } from './reducer';

// @ts-expect-error TS7006
const mapStateToProps = (state, { name }) => ({
    field: fromFields.getFieldByName(state, name),
    inverted: fromSearch.isFacetValuesInverted(state, name),
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
