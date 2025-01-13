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
import EnrichmentStatus from './EnrichmentStatus';
import { IN_PROGRESS } from '../../../../common/taskStatus';
import { launchAllEnrichment, retryEnrichment } from '.';
import RunButton from './RunButton';

const EnrichmentListToolBar = ({
    polyglot,
    onLaunchAllEnrichment,
    areEnrichmentsRunning,
}) => {
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
                    disabled={areEnrichmentsRunning}
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
    areEnrichmentsRunning: PropTypes.bool.isRequired,
};

export const EnrichmentList = ({
    enrichments,
    p: polyglot,
    onLaunchAllEnrichment,
    onRetryEnrichment,
}) => {
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
                        renderCell: (params) => (
                            <EnrichmentStatus
                                polyglot={polyglot}
                                id={params.row._id}
                            />
                        ),
                    },
                    {
                        field: 'run',
                        headerName: polyglot.t('run'),
                        flex: 1,
                        renderCell: (params) => {
                            return (
                                <RunButton
                                    id={params.row._id}
                                    polyglot={polyglot}
                                    variant="text"
                                />
                            );
                        },
                    },
                    {
                        field: 'errors',
                        headerName: polyglot.t('errors'),
                        flex: 1,
                        renderCell: (params) => {
                            return (
                                <>
                                    {polyglot.t('enrichment_error_count', {
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
                                    >
                                        {polyglot.t('retry')}
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
                            polyglot={polyglot}
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
    p: polyglotPropTypes.isRequired,
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

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(EnrichmentList);
