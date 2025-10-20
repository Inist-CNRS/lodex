import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { fromUser } from '../sharedSelectors';

interface PrivateRouteProps {
    isAdmin: boolean;
    component: React.ElementType;
}

const PrivateRoute = ({
    isAdmin,
    component: Component,
    ...rest
}: PrivateRouteProps) => (
    <Route
        {...rest}
        render={() => (isAdmin ? <Component /> : <Redirect to="/login" />)}
    />
);

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    isAdmin: fromUser.isAdmin(state),
});

// @ts-expect-error TS2345
export default withRouter(connect(mapStateToProps)(PrivateRoute));
