import React from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
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
import EnrichmentStatus from './EnrichmentStatus';
import { launchAllEnrichment, retryEnrichment } from '.';
import RunButton from './RunButton';
import { IN_PROGRESS } from '../../../../common/taskStatus';
import { useTranslate } from '../../i18n/I18NContext';

const EnrichmentListToolBar = ({
    onLaunchAllEnrichment,
    areEnrichmentsRunning,
}) => {
    const { translate } = useTranslate();
    return (
        <GridToolbarContainer>
            <Tooltip title={translate(`column_tooltip`)}>
                <GridToolbarColumnsButton />
            </Tooltip>
            <GridToolbarFilterButton />
            <Tooltip title={translate(`density_tooltip`)}>
                <GridToolbarDensitySelector />
            </Tooltip>
            <Tooltip title={translate(`add_more_enrichment`)}>
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
                    {translate('add_more')}
                </Button>
            </Tooltip>
            <Tooltip title={translate(`run_all`)}>
                <Button
                    startIcon={<PlayArrowIcon />}
                    size="small"
                    sx={{
                        '&.MuiButtonBase-root:hover': {
                            color: 'primary.main',
                        },
                    }}
                    disabled={areEnrichmentsRunning}
                    onClick={() => {
                        onLaunchAllEnrichment();
                    }}
                >
                    {translate('run_all')}
                </Button>
            </Tooltip>
        </GridToolbarContainer>
    );
};

EnrichmentListToolBar.propTypes = {
    onLaunchAllEnrichment: PropTypes.func,
    areEnrichmentsRunning: PropTypes.bool.isRequired,
};

export const EnrichmentList = ({
    enrichments,
    onLaunchAllEnrichment,
    onRetryEnrichment,
}) => {
    const { translate } = useTranslate();
    const history = useHistory();
    const areEnrichmentsRunning = enrichments.some(
        (enrichment) => enrichment.status === IN_PROGRESS,
    );
    const handleRowClick = (params) => {
        history.push(`/data/enrichment/${params.row._id}`);
    };

    return (
        <Box>
            <DataGrid
                columns={[
                    {
                        field: 'name',
                        headerName: translate('fieldName'),
                        flex: 1,
                    },
                    {
                        field: 'sourceColumn',
                        headerName: translate('sourceColumn'),
                        flex: 1,
                        renderCell: (params) => {
                            return params.value ? params.value : '-';
                        },
                    },
                    {
                        field: 'subPath',
                        headerName: translate('subPath'),
                        flex: 1,
                        renderCell: (params) => {
                            return params.value ? params.value : '-';
                        },
                    },
                    {
                        field: 'advancedMode',
                        headerName: translate('advancedMode'),
                        flex: 1,
                        renderCell: (params) => {
                            return params.value ? <CheckIcon /> : <CloseIcon />;
                        },
                    },
                    {
                        field: 'status',
                        headerName: translate('enrichment_status'),
                        flex: 1,
                        renderCell: (params) => (
                            <EnrichmentStatus id={params.row._id} />
                        ),
                    },
                    {
                        field: 'run',
                        headerName: translate('run'),
                        flex: 1,
                        renderCell: (params) => {
                            return (
                                <RunButton id={params.row._id} variant="text" />
                            );
                        },
                    },
                    {
                        field: 'errors',
                        headerName: translate('errors'),
                        flex: 1,
                        renderCell: (params) => {
                            return (
                                <>
                                    {translate('enrichment_error_count', {
                                        errorCount: params.row.errorCount ?? 0,
                                    })}
                                    <Button
                                        color="primary"
                                        onClick={(event) => {
                                            onRetryEnrichment({
                                                id: params.id,
                                            });
                                            event.preventDefault();
                                            event.stopPropagation();
                                        }}
                                        disabled={
                                            (params.row.errorCount ?? 0) === 0
                                        }
                                    >
                                        {translate('retry')}
                                    </Button>
                                </>
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
                            onLaunchAllEnrichment={onLaunchAllEnrichment}
                            areEnrichmentsRunning={areEnrichmentsRunning}
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
    onLaunchEnrichment: PropTypes.func.isRequired,
    onLaunchAllEnrichment: PropTypes.func.isRequired,
    onRetryEnrichment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    enrichments: state.enrichment.enrichments,
});

const mapDispatchToProps = {
    onLaunchAllEnrichment: launchAllEnrichment,
    onRetryEnrichment: retryEnrichment,
};

export default connect(mapStateToProps, mapDispatchToProps)(EnrichmentList);
