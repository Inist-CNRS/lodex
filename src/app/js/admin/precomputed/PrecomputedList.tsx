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
import { RunButton } from './RunButton';
import { fromPrecomputed } from '../selectors';
import { launchPrecomputed } from '.';
import { IN_PROGRESS, FINISHED, ON_HOLD } from '../../../../common/taskStatus';
import { toast } from '../../../../common/tools/toast';
import { useTranslate } from '../../i18n/I18NContext';
import { PrecomputedStatus } from './PrecomputedStatus';

export const PrecomputedList = ({
    // @ts-expect-error TS7031
    precomputedList,
    // @ts-expect-error TS7031
    isPrecomputedRunning,
    // @ts-expect-error TS7031
    onLaunchPrecomputed,
}) => {
    const { translate } = useTranslate();
    const history = useHistory();
    // @ts-expect-error TS7006
    const handleRowClick = (params) => {
        history.push(`/data/precomputed/${params.row._id}`);
    };

    // @ts-expect-error TS7006
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
                    {/*
                     // @ts-expect-error TS2741 */}
                    <GridToolbarColumnsButton />
                </Tooltip>
                <GridToolbarFilterButton />
                <Tooltip title={translate(`density_tooltip`)}>
                    {/*
                     // @ts-expect-error TS2741 */}
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
                        renderCell: (params) => (
                            <PrecomputedStatus
                                status={params.row.status}
                                startedAt={params.row.startedAt}
                            />
                        ),
                    },
                    {
                        field: 'run',
                        headerName: translate('run'),
                        flex: 2,
                        renderCell: (params) => {
                            return (
                                <RunButton
                                    handleLaunchPrecomputed={handleLaunchPrecomputed(
                                        params.row,
                                    )}
                                    precomputedStatus={params.row.status}
                                    variant="text"
                                />
                            );
                        },
                    },
                ]}
                rows={precomputedList}
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

PrecomputedList.propTypes = {
    precomputedList: PropTypes.array.isRequired,
    onLaunchPrecomputed: PropTypes.func.isRequired,
    isPrecomputedRunning: PropTypes.bool,
};

// @ts-expect-error TS7006
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
