// @ts-expect-error TS6133
import React from 'react';
import compose from 'recompose/compose';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
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
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { translate } from '../../i18n/I18NContext';

// @ts-expect-error TS7031
export const SubresourceList = ({ subresources, p: polyglot }) => {
    const history = useHistory();
    // @ts-expect-error TS7006
    const handleRowClick = (params) => {
        history.push(`/display/document/subresource/${params.row._id}`);
    };

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <Tooltip title={polyglot.t(`column_tooltip`)}>
                    {/*
                     // @ts-expect-error TS2741 */}
                    <GridToolbarColumnsButton />
                </Tooltip>
                <GridToolbarFilterButton />
                <Tooltip title={polyglot.t(`density_tooltip`)}>
                    {/*
                     // @ts-expect-error TS2741 */}
                    <GridToolbarDensitySelector />
                </Tooltip>
                <Tooltip title={polyglot.t(`add_more_subresource`)}>
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
                        {polyglot.t('add_more')}
                    </Button>
                </Tooltip>
            </GridToolbarContainer>
        );
    };

    return (
        <Box>
            <DataGrid
                columns={[
                    {
                        field: 'name',
                        headerName: polyglot.t('subresource_name'),
                        flex: 1,
                    },
                    {
                        field: 'path',
                        headerName: polyglot.t('subresource_path'),
                        flex: 1,
                        renderCell: (params) => {
                            return params.value ? params.value : '-';
                        },
                    },
                    {
                        field: 'identifier',
                        headerName: polyglot.t('subresource_id'),
                        flex: 1,
                        renderCell: (params) => {
                            return params.value ? params.value : '-';
                        },
                    },
                ]}
                rows={subresources}
                getRowId={(row) => row._id}
                autoHeight
                // @ts-expect-error TS2322
                width="100%"
                onRowClick={handleRowClick}
                components={{
                    Toolbar: CustomToolbar,
                }}
                sx={{
                    '& .MuiDataGrid-cell:hover': {
                        cursor: 'pointer',
                    },
                }}
            />
        </Box>
    );
};

SubresourceList.propTypes = {
    subresources: PropTypes.array.isRequired,
    p: polyglotPropTypes.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    subresources: state.subresource.subresources,
});

// @ts-expect-error TS2345
export default compose(translate, connect(mapStateToProps))(SubresourceList);
