import React from 'react';
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
import { renderStatus, renderRunButton } from './PrecomputedForm';
import { fromPrecomputed } from '../selectors';
import { launchPrecomputed } from '.';
import { IN_PROGRESS, FINISHED, ON_HOLD } from '../../../../common/taskStatus';
import { toast } from '../../../../common/tools/toast';
import { useTranslate } from '../../i18n/I18NContext';

export const PrecomputedList = ({
    precomputedList,
    isPrecomputedRunning,
    onLaunchPrecomputed,
}) => {
    const { translate } = useTranslate();
    const history = useHistory();
    const handleRowClick = (params) => {
        history.push(`/data/precomputed/${params.row._id}`);
    };

    const handleLaunchPrecomputed = (params) => (event) => {
        event.stopPropagation();
        if (isPrecomputedRunning) {
            toast(translate('pending_precomputed'), {
                type: toast.TYPE.INFO,
            });
        }
        onLaunchPrecomputed({
            id: params._id,
            action: params.status === FINISHED ? 'relaunch' : 'launch',
        });
    };

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <Tooltip title={translate(`column_tooltip`)}>
                    <GridToolbarColumnsButton />
                </Tooltip>
                <GridToolbarFilterButton />
                <Tooltip title={translate(`density_tooltip`)}>
                    <GridToolbarDensitySelector />
                </Tooltip>
                <Tooltip title={translate(`add_more_precomputed`)}>
                    <Button
                        component={Link}
                        to="/data/precomputed/add"
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

    return (
        <Box>
            <DataGrid
                columns={[
                    {
                        field: 'name',
                        headerName: translate('name'),
                        flex: 3,
                    },
                    {
                        field: 'webServiceUrl',
                        headerName: translate('webServiceUrl'),
                        flex: 4,
                    },
                    {
                        field: 'sourceColumns',
                        headerName: translate('sourceColumns'),
                        flex: 3,
                    },
                    {
                        field: 'status',
                        headerName: translate('precomputed_status'),
                        flex: 3,
                        renderCell: (params) =>
                            renderStatus(
                                params.row.status,
                                translate,
                                params.row.startedAt,
                            ),
                    },
                    {
                        field: 'run',
                        headerName: translate('run'),
                        flex: 2,
                        renderCell: (params) => {
                            return renderRunButton(
                                handleLaunchPrecomputed(params.row),
                                params.row.status,
                                translate,
                                'text',
                            );
                        },
                    },
                ]}
                rows={precomputedList}
                getRowId={(row) => row._id}
                autoHeight
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

PrecomputedList.propTypes = {
    precomputedList: PropTypes.array.isRequired,
    onLaunchPrecomputed: PropTypes.func.isRequired,
    isPrecomputedRunning: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    precomputedList: state.precomputed.precomputed,
    isPrecomputedRunning: !!fromPrecomputed
        .precomputed(state)
        .find(
            (precomputedData) =>
                precomputedData.status === IN_PROGRESS ||
                precomputedData.status === ON_HOLD,
        ),
});

const mapDispatchToProps = {
    onLaunchPrecomputed: launchPrecomputed,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrecomputedList);
