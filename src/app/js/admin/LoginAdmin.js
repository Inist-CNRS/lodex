import React from 'react';
import Link from '@mui/material/Link';

import Login from '../user/Login';

const LoginAdmin = () => {
    return (
        <>
            <Login />
            <Link
                color="primary"
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
                href="/instances"
            >
                Root adminstration
            </Link>
        </>
    );
};

export default LoginAdmin;
