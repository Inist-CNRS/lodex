import '@babel/polyfill';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';

import {
    createTheme as createThemeMui,
    ThemeProvider,
} from '@mui/material/styles';

import getLocale from '../../../common/getLocale';
import { frFR as frFRDatagrid, enUS as enUSDatagrid } from '@mui/x-data-grid';
import { frFR, enUS } from '@mui/material/locale';
import rootTheme from '../../custom/rootTheme';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Tenants from './Tenants';
import LoginForm from './LoginForm';
import { ROOT_ROLE } from '../../../common/tools/tenantTools';

const localesMUI = new Map([
    ['fr', { ...frFR, ...frFRDatagrid }],
    ['en', { ...enUS, ...enUSDatagrid }],
]);

const locale = getLocale();

export default function RootAdmin() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('');

    useEffect(() => {
        // if no cookie found, remove the user from localStorage
        const user = JSON.parse(localStorage.getItem('root-admin-user'));
        if (user && user.role === ROOT_ROLE) {
            setIsLoggedIn(true);
            setRole(user.role);
        }
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setRole('');
        localStorage.removeItem('root-admin-user');
        fetch('/api/logout', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'X-Lodex-Tenant': 'admin',
            },
        }).then(response => response.json());
    };

    return (
        <ThemeProvider
            theme={createThemeMui(rootTheme, localesMUI.get(locale))} // TODO: Replace theme to be blue
        >
            <Router basename="/instances">
                <div>
                    <AppBar position="static">
                        <Toolbar>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    flex: 1,
                                    alignItems: 'stretch',
                                }}
                            >
                                <Typography variant="h6" color="inherit">
                                    Configuration des instances
                                </Typography>
                                {isLoggedIn && (
                                    <Button
                                        onClick={handleLogout}
                                        aria-label="signout"
                                        color="inherit"
                                    >
                                        <ExitToAppIcon />
                                        <Box component="span" ml={1}>
                                            Déconnexion
                                        </Box>
                                    </Button>
                                )}
                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Switch>
                        <Route exact path="/">
                            {isLoggedIn ? (
                                <Redirect to="/admin" />
                            ) : (
                                <Redirect to="/login" />
                            )}
                        </Route>
                        <Route exact path="/login">
                            {isLoggedIn ? (
                                <Redirect to="/admin" />
                            ) : (
                                <LoginForm />
                            )}
                        </Route>
                        <Route path="/admin">
                            {isLoggedIn && role === ROOT_ROLE ? (
                                <Tenants handleLogout={handleLogout} />
                            ) : (
                                <Redirect to="/login" />
                            )}
                        </Route>
                    </Switch>
                </div>
            </Router>
        </ThemeProvider>
    );
}

render(<RootAdmin />, document.getElementById('root'));
