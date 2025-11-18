import AddBoxIcon from '@mui/icons-material/AddBox';

import { useSelector } from 'react-redux';
import { Box, Button, Tooltip } from '@mui/material';
import {
    DataGrid,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { fromSubresources } from '../selectors';
import { useRef } from 'react';

const CustomToolbar = () => {
    const { translate } = useTranslate();
    const ref = useRef(null);

    return (
        <GridToolbarContainer ref={ref}>
            <Tooltip title={translate(`column_tooltip`)}>
                <GridToolbarColumnsButton touchRippleRef={ref} />
            </Tooltip>
            <GridToolbarFilterButton />
            <Tooltip title={translate(`density_tooltip`)}>
                <GridToolbarDensitySelector touchRippleRef={ref} />
            </Tooltip>
            <Tooltip title={translate(`add_more_subresource`)}>
                <Button
                    component={Link}
                    to="/display/document/subresource/add"
                    startIcon={<AddBoxIcon />}
                    size="small"
                    sx={{
                        '&.MuiButtonBase-root:hover': {
                            color: 'primary.main',
                        },
                    }}
                >
                    {translate('add_more')}
                </Button>
            </Tooltip>
        </GridToolbarContainer>
    );
};

export const SubresourceList = () => {
    const { translate } = useTranslate();
    const history = useHistory();
    const handleRowClick = (params: { row: { _id: string } }) => {
        history.push(`/display/document/subresource/${params.row._id}`);
    };

    const subresources = useSelector(fromSubresources.getSubresources);

    return (
        <Box>
            <DataGrid
                columns={[
                    {
                        field: 'name',
                        headerName: translate('subresource_name'),
                        flex: 1,
                    },
                    {
                        field: 'path',
                        headerName: translate('subresource_path'),
                        flex: 1,
                        renderCell: (params) => {
                            return params.value ? params.value : '-';
                        },
                    },
                    {
                        field: 'identifier',
                        headerName: translate('subresource_id'),
                        flex: 1,
                        renderCell: (params) => {
                            return params.value ? params.value : '-';
                        },
                    },
                ]}
                rows={subresources}
                rowBuffer={100}
                getRowId={(row) => row._id}
                autoHeight
                onRowClick={handleRowClick}
                components={{
                    Toolbar: CustomToolbar,
                }}
                sx={{
                    '& .MuiDataGrid-cell:hover': {
                        cursor: 'pointer',
                    },
                    width: '100%',
                }}
            />
        </Box>
    );
};

export default SubresourceList;
