import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
// @ts-expect-error TS2882
import 'react-toastify/dist/ReactToastify.css';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { getHost } from '@lodex/common';
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
    Alert,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { sizeConverter } from './rootAdminUtils';
import type { Tenant } from './types';
import { useTenants } from './useTenants';

const baseUrl = getHost();

type CustomToolbarProps = {
    handleLogout(): void;
};

const CustomToolbar = ({ handleLogout }: CustomToolbarProps) => {
    const [openCreateTenantDialog, setOpenCreateTenantDialog] = useState(false);
    return (
        <>
            <GridToolbarContainer>
                <Tooltip title={'Colonnes'}>
                    {/*
                     // @ts-expect-error TS2741 */}
                    <GridToolbarColumnsButton />
                </Tooltip>
                {/*
                     // @ts-expect-error TS2741 */}
                <GridToolbarFilterButton />
                <Tooltip title={'Densité'}>
                    {/*
                     // @ts-expect-error TS2741 */}
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

            <CreateTenantDialog
                isOpen={openCreateTenantDialog}
                handleClose={() => setOpenCreateTenantDialog(false)}
                onError={handleLogout}
            />
        </>
    );
};

type TenantsProps = {
    handleLogout(): void;
};

const Tenants = ({ handleLogout }: TenantsProps) => {
    const [tenantToDelete, setTenantToDelete] = useState<null | Tenant>(null);
    const [tenantToUpdate, setTenantToUpdate] = useState<Tenant | null>(null);

    const {
        data: tenants = [],
        isLoading,
        isError,
        error,
    } = useTenants(handleLogout);

    const formatValue = (value: string | null) => {
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
            // @ts-expect-error TS7006
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
            // @ts-expect-error TS7006
            valueFormatter: (params) => {
                return formatValue(params.value);
            },
            // @ts-expect-error TS7006
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
            // @ts-expect-error TS7006
            valueFormatter: (params) => {
                return formatValue(params.value);
            },
        },
        {
            field: 'createdAt',
            headerName: 'Créée le',
            flex: 2,
            // @ts-expect-error TS7006
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
            // @ts-expect-error TS7006
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
            // @ts-expect-error TS7006
            valueFormatter: (params) => {
                return params.value ? 'Oui' : 'Non';
            },
        },
        {
            field: 'totalSize',
            headerName: 'Taille Base de données',
            flex: 2,
            sortable: true,
            // @ts-expect-error TS7006
            valueFormatter: (params) => {
                return sizeConverter(params.value);
            },
        },
        {
            field: 'update',
            headerName: 'Modifier',
            flex: 1,
            // @ts-expect-error TS7006
            renderCell: (params) => {
                return (
                    <IconButton
                        color="warning"
                        size="large"
                        onClick={() => setTenantToUpdate(params.row)}
                        title={`Editer ${params.row.name}`}
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
            // @ts-expect-error TS7006
            renderCell: (params) => {
                if (params.row.name === 'default') {
                    return null;
                }
                return (
                    <IconButton
                        color="error"
                        size="large"
                        onClick={() => {
                            setTenantToDelete(params.row);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                );
            },
        },
    ];

    // Handle error state
    if (isError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Erreur lors du chargement des instances:{' '}
                    {(error as Error)?.message || 'Erreur inconnue'}
                </Alert>
            </Box>
        );
    }

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
                    rowBuffer={100}
                    getRowId={(row) => row._id}
                    rows={tenants}
                    columns={columns}
                    loading={isLoading}
                    components={{
                        Toolbar: () => (
                            <CustomToolbar handleLogout={handleLogout} />
                        ),
                    }}
                    sx={{
                        "& .MuiDataGrid-cell[data-field='name']": {
                            padding: 0,
                        },
                    }}
                />
            </div>
            <UpdateTenantDialog
                isOpen={!!tenantToUpdate}
                tenant={tenantToUpdate}
                handleClose={() => setTenantToUpdate(null)}
                handleLogout={handleLogout}
            />

            <DeleteTenantDialog
                isOpen={!!tenantToDelete}
                tenant={tenantToDelete}
                onClose={() => setTenantToDelete(null)}
                onError={handleLogout}
            />
            <ToastContainer />
        </>
    );
};

export default Tenants;
