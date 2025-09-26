import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import { Route, Redirect } from 'react-router-dom';
// @ts-expect-error TS7016
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { fromUser } from '../sharedSelectors';

// @ts-expect-error TS7031
const PrivateRoute = ({ isAdmin, component: Component, ...rest }) => (
    <Route
        {...rest}
        render={() => (isAdmin ? <Component /> : <Redirect to="/login" />)}
    />
);

PrivateRoute.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    component: PropTypes.elementType.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    isAdmin: fromUser.isAdmin(state),
});

export default withRouter(connect(mapStateToProps)(PrivateRoute));
