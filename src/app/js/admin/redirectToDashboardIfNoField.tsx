import React from 'react';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import { Redirect } from 'react-router';
// @ts-expect-error TS7016
import { compose, branch, renderComponent } from 'recompose';

import { fromFields } from '../sharedSelectors';

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    nbFields: fromFields.getNbFields(state),
    // @ts-expect-error TS2339
    isLoading: fromFields.isLoading(state),
});

export default compose(
    connect(mapStateToProps),
    branch(
        // @ts-expect-error TS7031
        ({ isLoading, nbFields }) => !isLoading && nbFields === 0,
        renderComponent(() => <Redirect to="/" />),
    ),
);
