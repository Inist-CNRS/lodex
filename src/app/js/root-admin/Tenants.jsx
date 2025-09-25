import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { getHost } from '../../../common/uris';
import CreateTenantDialog from './CreateTenantDialog';
import DeleteTenantDialog from './DeleteTenantDialog';
import UpdateTenantDialog from './UpdateTenantDialog';
import {
    DataGrid,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import {
    Box,
    Button,
    IconButton,
    Link,
    Tooltip,
    Typography,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { sizeConverter } from './rootAdminUtils';

const baseUrl = getHost();

const Tenants = ({ handleLogout }) => {
    const [tenants, setTenants] = useState([]);
    const [openCreateTenantDialog, setOpenCreateTenantDialog] = useState(false);
    const [openDeleteTenantDialog, setOpenDeleteTenantDialog] = useState(false);
    const [tenantToUpdate, setTenantToUpdate] = useState(null);

    const onChangeTenants = (changedTenants) => {
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
            .then((response) => {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }
                return response;
            })
            .then((response) => response.json())
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
            .then((response) => {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }

                if (response.status === 403) {
                    toast.error('Action non autorisée', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        theme: 'light',
                    });
                    return;
                }

                if (response.status === 200) {
                    toast.success('Instance créée', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        theme: 'light',
                    });
                }

                return response.json();
            })
            .then((data) => {
                onChangeTenants(data);
                setOpenCreateTenantDialog(false);
            });
    };

    const updateTenant = (id, updatedTenant) => {
        fetch(`/rootAdmin/tenant/${id}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Lodex-Tenant': 'admin',
            },
            method: 'PUT',
            body: JSON.stringify(updatedTenant),
        })
            .then((response) => {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }

                if (response.status === 403) {
                    toast.error('Action non autorisée', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        theme: 'light',
                    });
                    return;
                }

                if (response.status === 200) {
                    if (response.status === 200) {
                        toast.success('Instance modifiée', {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            theme: 'light',
                        });
                    }
                }

                return response.json();
            })
            .then((data) => {
                onChangeTenants(data);
                setTenantToUpdate(null);
            });
    };

    const deleteTenant = (_id, name, deleteDatabase) => {
        fetch('/rootAdmin/tenant', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Lodex-Tenant': 'admin',
            },
            method: 'DELETE',
            body: JSON.stringify({ _id, name, deleteDatabase }),
        })
            .then((response) => {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }

                if (response.status === 403) {
                    toast.error('Action non autorisée', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        theme: 'light',
                    });
                    return;
                }

                if (response.status === 200) {
                    if (response.status === 200) {
                        toast.success('Instance supprimée', {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            theme: 'light',
                        });
                    }
                }

                return response.json();
            })
            .then((data) => {
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

    const formatValue = (value) => {
        if (value == null) {
            return '-';
        }
        return value;
    };

    // Define the columns for the datagrid
    const columns = [
        { field: '_id', headerName: 'ID', width: 200 },
        {
            field: 'name',
            headerName: 'Nom',
            flex: 4,
            renderCell: (params) => {
                const name = params.row.name;
                return (
                    <Box
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            outline: 'none',
                            textDecoration: 'none',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px',
                            '&:focus': {
                                borderBottom: '1px solid',
                                background: '#D9F3FF',
                            },
                            '&:hover': {
                                borderBottom: '1px solid',
                                background: '#D9F3FF',
                                textDecoration: 'none',
                            },
                        }}
                    >
                        <Link
                            href={`${baseUrl}/instance/${name}`}
                            target="_blank"
                            title={params.value}
                            color="primary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                outline: 'none',
                                textDecoration: 'none',
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 16px',
                                '&:focus': {
                                    textDecoration: 'none',
                                },
                                '&:hover': {
                                    textDecoration: 'none',
                                },
                            }}
                        >
                            {params.value}
                        </Link>
                        <IconButton
                            size="large"
                            href={`${baseUrl}/instance/${name}/admin`}
                            target="_blank"
                            color="primary"
                        >
                            <AdminPanelSettingsIcon />
                        </IconButton>
                    </Box>
                );
            },
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 4,
            valueFormatter: (params) => {
                return formatValue(params.value);
            },
            renderCell: (params) => {
                return (
                    <Typography
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                        title={params.value}
                    >
                        {params.value}
                    </Typography>
                );
            },
        },
        {
            field: 'author',
            headerName: 'Auteur',
            flex: 2,
            valueFormatter: (params) => {
                return formatValue(params.value);
            },
        },
        {
            field: 'createdAt',
            headerName: 'Créée le',
            flex: 2,
            valueFormatter: (params) => {
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
            field: 'dataset',
            headerName: 'Données',
            flex: 2,
            sortable: true,
            valueFormatter: (params) => {
                if (!params.value) {
                    return '-';
                }

                return params.value;
            },
        },
        {
            field: 'published',
            headerName: 'Données publiées',
            flex: 2,
            sortable: true,
            valueFormatter: (params) => {
                return params.value ? 'Oui' : 'Non';
            },
        },
        {
            field: 'totalSize',
            headerName: 'Taille Base de données',
            flex: 2,
            sortable: true,
            valueFormatter: (params) => {
                return sizeConverter(params.value);
            },
        },
        {
            field: 'update',
            headerName: 'Modifier',
            flex: 1,
            renderCell: (params) => {
                return (
                    <IconButton
                        color="warning"
                        size="large"
                        onClick={() => setTenantToUpdate(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                );
            },
        },
        {
            field: 'delete',
            headerName: 'Supprimer',
            flex: 1,
            renderCell: (params) => {
                if (params.row.name === 'default') {
                    return null;
                }
                return (
                    <IconButton
                        color="error"
                        size="large"
                        onClick={() => setOpenDeleteTenantDialog(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                );
            },
        },
    ];

    return (
        <>
            <div
                style={{
                    height: `calc(100vh - 64px - 24px)`,
                    width: `calc(100vw - 24px)`,
                    margin: '12px',
                }}
            >
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={tenants}
                    columns={columns}
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                    sx={{
                        "& .MuiDataGrid-cell[data-field='name']": {
                            padding: 0,
                        },
                    }}
                />
            </div>
            <CreateTenantDialog
                isOpen={openCreateTenantDialog}
                handleClose={() => setOpenCreateTenantDialog(false)}
                createAction={addTenant}
            />
            <UpdateTenantDialog
                isOpen={!!tenantToUpdate}
                tenant={tenantToUpdate}
                handleClose={() => setTenantToUpdate(null)}
                updateAction={updateTenant}
            />

            <DeleteTenantDialog
                isOpen={!!openDeleteTenantDialog}
                tenant={openDeleteTenantDialog}
                handleClose={() => setOpenDeleteTenantDialog(false)}
                deleteAction={deleteTenant}
            />
            <ToastContainer />
        </>
    );
};

Tenants.propTypes = {
    handleLogout: PropTypes.func.isRequired,
};

export default Tenants;
