import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { fromUser } from '../sharedSelectors';

const PrivateRoute = ({ isAdmin, component: Component, ...rest }) => (
    <Route
        {...rest}
        render={() => (isAdmin ? <Component /> : <Redirect to="/login" />)}
    />
);

PrivateRoute.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    component: PropTypes.element.isRequired,
};

const mapStateToProps = state => ({
    isAdmin: fromUser.isAdmin(state),
});

export default withRouter(connect(mapStateToProps)(PrivateRoute));
