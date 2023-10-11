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
import rootTheme from '../../custom/rootTheme';
import {
    AppBar,
    Box,
    Button,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { getHost } from '../../../common/uris';
import CreateTenantDialog from './CreateTenantDialog';
import DeleteTenantDialog from './DeleteTenantDialog';

const localesMUI = new Map([
    ['fr', { ...frFR, ...frFRDatagrid }],
    ['en', { ...enUS, ...enUSDatagrid }],
]);

const locale = getLocale();
const baseUrl = getHost();

const App = () => {
    const [tenants, setTenants] = useState([]);
    const [openCreateTenantDialog, setOpenCreateTenantDialog] = useState(false);
    const [openDeleteTenantDialog, setOpenDeleteTenantDialog] = useState(false);

    const onChangeTenants = changedTenants => {
        if (changedTenants instanceof Array) {
            setTenants(changedTenants);
        }
    };

    useEffect(() => {
        fetch('/rootAdmin/tenant', {
            credentials: 'include',
            headers: {
                'X-Lodex-Tenant': 'admin',
            },
        })
            .then(response => response.json())
            .then(onChangeTenants);
    }, []);

    const addTenant = name => {
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
                onChangeTenants(data);
                setOpenCreateTenantDialog(false);
            });
    };

    const deleteTenant = (_id, name) => {
        fetch('/rootAdmin/tenant', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Lodex-Tenant': 'admin',
            },
            method: 'DELETE',
            body: JSON.stringify({ _id, name }),
        })
            .then(response => response.json())
            .then(data => {
                onChangeTenants(data);
                setOpenDeleteTenantDialog(false);
            });
    };

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <Tooltip title="Ajoute une instance">
                    <Button
                        onClick={() => setOpenCreateTenantDialog(true)}
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

    // Define the columns for the datagrid
    const columns = [
        { field: '_id', headerName: 'ID', width: 200 },
        { field: 'name', headerName: 'Name', width: 150 },
        {
            field: 'open',
            headerName: 'Open',
            width: 150,
            renderCell: params => {
                const name = params.row.name;
                return (
                    <Button target={name} href={`${baseUrl}/instance/${name}`}>
                        OPEN
                    </Button>
                );
            },
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 150,
            renderCell: params => {
                return (
                    <Button
                        color="error"
                        onClick={() => setOpenDeleteTenantDialog(params.row)}
                    >
                        <DeleteIcon />
                    </Button>
                );
            },
        },
    ];

    return (
        <ThemeProvider
            theme={createThemeMui(rootTheme, localesMUI.get(locale))} // TODO: Replace theme to be blue
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
                            disabled
                            onClick={() =>
                                console.warn('TODO Signout and enable')
                            }
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
                    rows={tenants}
                    columns={columns}
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                />
            </div>
            <CreateTenantDialog
                isOpen={openCreateTenantDialog}
                handleClose={() => setOpenCreateTenantDialog(false)}
                createAction={addTenant}
            />
            <DeleteTenantDialog
                tenant={openDeleteTenantDialog}
                handleClose={() => setOpenDeleteTenantDialog(false)}
                deleteAction={deleteTenant}
            />
        </ThemeProvider>
    );
};

render(<App />, document.getElementById('root'));
