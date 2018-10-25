import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { compose, branch, renderComponent } from 'recompose';

import { fromFields } from '../sharedSelectors';

const mapStateToProps = state => ({
    nbFields: fromFields.getNbFields(state),
    isLoading: fromFields.isLoading(state),
});

export default compose(
    connect(mapStateToProps),
    branch(
        ({ isLoading, nbFields }) => !isLoading && nbFields === 0,
        renderComponent(() => <Redirect to="/dashboard" />),
    ),
);
