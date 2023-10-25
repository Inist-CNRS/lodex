import React, { useEffect, useState } from 'react';

import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';

import { getHost } from '../../../common/uris';
import CreateTenantDialog from './CreateTenantDialog';
import DeleteTenantDialog from './DeleteTenantDialog';
import {
    DataGrid,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { Button, Tooltip } from '@mui/material';

const baseUrl = getHost();

const Tenants = () => {
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

    const addTenant = ({ name, description, author }) => {
        fetch('/rootAdmin/tenant', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Lodex-Tenant': 'admin',
            },
            method: 'POST',
            body: JSON.stringify({ name, description, author }),
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
                <Tooltip title={'Colonnes'}>
                    <GridToolbarColumnsButton />
                </Tooltip>
                <GridToolbarFilterButton />
                <Tooltip title={'Densité'}>
                    <GridToolbarDensitySelector />
                </Tooltip>
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

    const formatValue = value => {
        if (value == null) {
            return '-';
        }
        return value;
    };

    // Define the columns for the datagrid
    const columns = [
        { field: '_id', headerName: 'ID', width: 200 },
        { field: 'name', headerName: 'Nom', width: 150 },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1,
            valueFormatter: params => {
                return formatValue(params.value);
            },
        },
        {
            field: 'author',
            headerName: 'Auteur',
            width: 150,
            valueFormatter: params => {
                return formatValue(params.value);
            },
        },
        {
            field: 'createdAt',
            headerName: 'Créé le',
            width: 150,
            valueFormatter: params => {
                if (params.value == null) {
                    return '-';
                }

                // Format the date
                const date = new Date(params.value);
                return date.toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            },
        },
        {
            field: 'open',
            headerName: 'Ouvrir',
            width: 150,
            renderCell: params => {
                const name = params.row.name;
                return (
                    <Button target={name} href={`${baseUrl}/instance/${name}`}>
                        Ouvrir
                    </Button>
                );
            },
        },
        {
            field: 'delete',
            headerName: 'Supprimer',
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
        <>
            <div style={{ height: `calc(100vh - 110px)`, width: '100%' }}>
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
        </>
    );
};

export default Tenants;
