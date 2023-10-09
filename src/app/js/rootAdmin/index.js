import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import {
    createTheme as createThemeMui,
    ThemeProvider,
} from '@mui/material/styles';

import getLocale from '../../../common/getLocale';
import {
    frFR as frFRDatagrid,
    enUS as enUSDatagrid,
    DataGrid,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import { frFR, enUS } from '@mui/material/locale';
import customTheme from '../../custom/customTheme';
import {
    AppBar,
    Box,
    Button,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddBoxIcon from '@mui/icons-material/AddBox';

import CreateInstanceDialog from './CreateInstanceDialog';

const localesMUI = new Map([
    ['fr', { ...frFR, ...frFRDatagrid }],
    ['en', { ...enUS, ...enUSDatagrid }],
]);

const locale = getLocale();

const App = () => {
    const [instances, setInstances] = useState([]);
    const [openCreateInstanceDialog, setOpenCreateInstanceDialog] = useState(
        false,
    );

    useEffect(() => {
        fetch('/rootAdmin/tenant', {
            credentials: 'include',
            headers: {
                'X-Lodex-Tenant': 'admin',
            },
        })
            .then(response => response.json())
            .then(setInstances);
    }, []);

    const addInstance = name => {
        fetch('/rootAdmin/tenant', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Lodex-Tenant': 'admin',
            },
            method: 'POST',
            body: JSON.stringify({ name }),
        })
            .then(response => response.json())
            .then(data => {
                setInstances(data);
                setOpenCreateInstanceDialog(false);
            });
    };

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <Tooltip title="Ajoute une instance">
                    <Button
                        onClick={() => setOpenCreateInstanceDialog(true)}
                        startIcon={<AddBoxIcon />}
                        size="small"
                        sx={{
                            '&.MuiButtonBase-root:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        Ajouter
                    </Button>
                </Tooltip>
            </GridToolbarContainer>
        );
    };

    return (
        <ThemeProvider
            theme={createThemeMui(customTheme, localesMUI.get(locale))} // TODO: Replace theme to be blue
        >
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
                        <Button
                            onClick={() => console.log('signout')}
                            aria-label="signout"
                            color="inherit"
                        >
                            <ExitToAppIcon />
                            <Box component="span" ml={1}>
                                Déconnexion
                            </Box>
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    getRowId={row => row._id}
                    rows={instances}
                    columns={columns}
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                />
            </div>
            <CreateInstanceDialog
                isOpen={openCreateInstanceDialog}
                handleClose={() => setOpenCreateInstanceDialog(false)}
                createAction={addInstance}
            />
        </ThemeProvider>
    );
};

// Define the columns for the datagrid
const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    { field: 'name', headerName: 'Name', width: 150 },
];

render(<App />, document.getElementById('root'));
