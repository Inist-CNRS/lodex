import React from 'react';
import compose from 'recompose/compose';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

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
import { renderStatus, renderRunButton } from './PrecomputedForm';
import { fromPrecomputed } from '../selectors';
import { launchPrecomputed } from '.';
import { IN_PROGRESS, FINISHED } from '../../../../common/taskStatus';
import { toast } from '../../../../common/tools/toast';

export const PrecomputedList = ({
    precomputedList,
    p: polyglot,
    isPrecomputedRunning,
    onLaunchPrecomputed,
}) => {
    const history = useHistory();
    const handleRowClick = params => {
        history.push(`/data/precomputed/${params.row._id}`);
    };

    const handleLaunchPrecomputed = params => event => {
        event.stopPropagation();
        if (isPrecomputedRunning) {
            toast(polyglot.t('pending_precomputed'), {
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
                <Tooltip title={polyglot.t(`column_tooltip`)}>
                    <GridToolbarColumnsButton />
                </Tooltip>
                <GridToolbarFilterButton />
                <Tooltip title={polyglot.t(`density_tooltip`)}>
                    <GridToolbarDensitySelector />
                </Tooltip>
                <Tooltip title={polyglot.t(`add_more_precomputed`)}>
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
                        headerName: polyglot.t('name'),
                        flex: 3,
                    },
                    {
                        field: 'webServiceUrl',
                        headerName: polyglot.t('webServiceUrl'),
                        flex: 4,
                    },
                    {
                        field: 'sourceColumns',
                        headerName: polyglot.t('sourceColumns'),
                        flex: 3,
                    },
                    {
                        field: 'status',
                        headerName: polyglot.t('precomputed_status'),
                        flex: 2,
                        renderCell: params =>
                            renderStatus(
                                params.row.status,
                                polyglot,
                                params.row.startedAt,
                            ),
                    },
                    {
                        field: 'run',
                        headerName: polyglot.t('run'),
                        flex: 1,
                        renderCell: params => {
                            return renderRunButton(
                                handleLaunchPrecomputed(params.row),
                                params.row.status,
                                polyglot,
                                'text',
                            );
                        },
                    },
                ]}
                rows={precomputedList}
                getRowId={row => row._id}
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
    p: polyglotPropTypes.isRequired,
    onLaunchPrecomputed: PropTypes.func.isRequired,
    isPrecomputedRunning: PropTypes.bool,
};

const mapStateToProps = state => ({
    precomputedList: state.precomputed.precomputed,
    isPrecomputedRunning: !!fromPrecomputed
        .precomputed(state)
        .find(precomputedData => precomputedData.status === IN_PROGRESS),
});

const mapDispatchToProps = {
    onLaunchPrecomputed: launchPrecomputed,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(PrecomputedList);
