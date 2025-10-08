// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
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
    isAdmin: fromUser.isAdmin(state),
});

// @ts-expect-error TS2345
export default withRouter(connect(mapStateToProps)(PrivateRoute));
