// @ts-expect-error TS6133
import React from 'react';

import Login from '../user/Login';

const LoginAdmin = () => {
    // @ts-expect-error TS2322
    return <Login target="root" />;
};

export default LoginAdmin;
