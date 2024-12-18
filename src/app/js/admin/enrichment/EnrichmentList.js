import React from 'react';
import compose from 'recompose/compose';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

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
import { renderRunButton, renderStatus } from './EnrichmentForm';
import { FINISHED, IN_PROGRESS } from '../../../../common/taskStatus';
import { launchAllEnrichment, launchEnrichment } from '.';
import { toast } from '../../../../common/tools/toast';

const EnrichmentListToolBar = ({ polyglot, onLaunchAllEnrichment }) => {
    return (
        <GridToolbarContainer>
            <Tooltip title={polyglot.t(`column_tooltip`)}>
                <GridToolbarColumnsButton />
            </Tooltip>
            <GridToolbarFilterButton />
            <Tooltip title={polyglot.t(`density_tooltip`)}>
                <GridToolbarDensitySelector />
            </Tooltip>
            <Tooltip title={polyglot.t(`add_more_enrichment`)}>
                <Button
                    component={Link}
                    to="/data/enrichment/add"
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
            <Tooltip title={polyglot.t(`run_all`)}>
                <Button
                    startIcon={<PlayArrowIcon />}
                    size="small"
                    sx={{
                        '&.MuiButtonBase-root:hover': {
                            color: 'primary.main',
                        },
                    }}
                    onClick={() => {
                        onLaunchAllEnrichment();
                    }}
                >
                    {polyglot.t('run_all')}
                </Button>
            </Tooltip>
        </GridToolbarContainer>
    );
};

EnrichmentListToolBar.propTypes = {
    polyglot: polyglotPropTypes.isRequired,
    onLaunchAllEnrichment: PropTypes.func,
};

export const EnrichmentList = ({
    enrichments,
    p: polyglot,
    onLaunchEnrichment,
    onLaunchAllEnrichment,
}) => {
    const history = useHistory();
    const isEnrichingRunning = enrichments.some(
        (enrichment) => enrichment.status === IN_PROGRESS,
    );
    const handleRowClick = (params) => {
        history.push(`/data/enrichment/${params.row._id}`);
    };

    const handleLaunchPrecomputed = (params) => (event) => {
        event.stopPropagation();
        if (isEnrichingRunning) {
            toast(polyglot.t('pending_enrichment'), {
                type: toast.TYPE.INFO,
            });
        }
        onLaunchEnrichment({
            id: params._id,
            action: params.status === FINISHED ? 'relaunch' : 'launch',
        });
    };

    return (
        <Box>
            <DataGrid
                columns={[
                    {
                        field: 'name',
                        headerName: polyglot.t('fieldName'),
                        flex: 1,
                    },
                    {
                        field: 'sourceColumn',
                        headerName: polyglot.t('sourceColumn'),
                        flex: 1,
                        renderCell: (params) => {
                            return params.value ? params.value : '-';
                        },
                    },
                    {
                        field: 'subPath',
                        headerName: polyglot.t('subPath'),
                        flex: 1,
                        renderCell: (params) => {
                            return params.value ? params.value : '-';
                        },
                    },
                    {
                        field: 'advancedMode',
                        headerName: polyglot.t('advancedMode'),
                        flex: 1,
                        renderCell: (params) => {
                            return params.value ? <CheckIcon /> : <CloseIcon />;
                        },
                    },
                    {
                        field: 'status',
                        headerName: polyglot.t('enrichment_status'),
                        flex: 1,
                        renderCell: (params) =>
                            renderStatus(params.value, polyglot),
                    },
                    {
                        field: 'run',
                        headerName: polyglot.t('run'),
                        flex: 1,
                        renderCell: (params) => {
                            return renderRunButton(
                                handleLaunchPrecomputed(params.row),
                                params.row.status,
                                polyglot,
                                'text',
                            );
                        },
                    },
                ]}
                rows={enrichments}
                getRowId={(row) => row._id}
                autoHeight
                width="100%"
                onRowClick={handleRowClick}
                components={{
                    Toolbar: () => (
                        <EnrichmentListToolBar
                            polyglot={polyglot}
                            onLaunchAllEnrichment={onLaunchAllEnrichment}
                        />
                    ),
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

EnrichmentList.propTypes = {
    enrichments: PropTypes.array.isRequired,
    p: polyglotPropTypes.isRequired,
    onLaunchEnrichment: PropTypes.func.isRequired,
    onLaunchAllEnrichment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    enrichments: state.enrichment.enrichments,
});

const mapDispatchToProps = {
    onLaunchEnrichment: launchEnrichment,
    onLaunchAllEnrichment: launchAllEnrichment,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(EnrichmentList);
