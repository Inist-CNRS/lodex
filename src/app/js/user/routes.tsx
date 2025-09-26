import React from 'react';
// @ts-expect-error TS7016
import { Route } from 'react-router-dom';

import Login from './Login';

const UserRoutes = <Route path="/login" component={Login} />;

export default UserRoutes;
