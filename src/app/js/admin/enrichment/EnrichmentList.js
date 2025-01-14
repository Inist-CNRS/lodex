import AddBoxIcon from '@mui/icons-material/AddBox';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PropTypes from 'prop-types';
import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { Box, Button, Tooltip } from '@mui/material';
import {
    DataGrid,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { launchAllEnrichment, retryEnrichment } from '.';
import { IN_PROGRESS } from '../../../../common/taskStatus';
import { ConfirmPopup } from '../../lib/components/ConfirmPopup';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { default as EnrichmentStatus } from './EnrichmentStatus';
import { default as RunButton } from './RunButton';

const EnrichmentListToolBar = ({
    polyglot,
    onLaunchAllEnrichment,
    areEnrichmentsRunning,
}) => {
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

    const handleOpenDialog = () => {
        setIsConfirmOpen(true);
    };

    const handleCloseDialog = () => {
        setIsConfirmOpen(false);
    };

    const handleLaunchAllEnrichment = () => {
        onLaunchAllEnrichment();
        handleCloseDialog();
    };

    return (
        <>
            <ConfirmPopup
                isOpen={isConfirmOpen}
                onClose={handleCloseDialog}
                onConfirm={handleLaunchAllEnrichment}
                title={polyglot.t('run_all_enrichment_modal_title')}
                description={polyglot.t('run_all_enrichment_modal_content')}
                confirmLabel={polyglot.t('run_all')}
                cancelLabel={polyglot.t('cancel')}
            />

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
                        onClick={handleOpenDialog}
                    >
                        {polyglot.t('run_all')}
                    </Button>
                </Tooltip>
            </GridToolbarContainer>
        </>
    );
};

EnrichmentListToolBar.propTypes = {
    polyglot: polyglotPropTypes.isRequired,
    onLaunchAllEnrichment: PropTypes.func,
    areEnrichmentsRunning: PropTypes.bool.isRequired,
};

export const EnrichmentList = ({
    enrichments,
    isLoadEnrichmentsPending,
    isRunAllEnrichmentPending,
    p: polyglot,
    onLaunchAllEnrichment,
    onRetryEnrichment,
}) => {
    const history = useHistory();
    const areEnrichmentsRunning =
        enrichments.some((enrichment) => enrichment.status === IN_PROGRESS) ||
        isLoadEnrichmentsPending ||
        isRunAllEnrichmentPending;
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
                                        disabled={
                                            (params.row.errorCount ?? 0) === 0
                                        }
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
    onLaunchAllEnrichment: PropTypes.func.isRequired,
    isLoadEnrichmentsPending: PropTypes.bool,
    isRunAllEnrichmentPending: PropTypes.bool,
    onRetryEnrichment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    enrichments: state.enrichment.enrichments,
    isLoadEnrichmentsPending: state.enrichment.isLoadEnrichmentsPending,
    isRunAllEnrichmentPending: state.enrichment.isRunAllEnrichmentPending,
});

const mapDispatchToProps = {
    onLaunchAllEnrichment: launchAllEnrichment,
    onRetryEnrichment: retryEnrichment,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(EnrichmentList);
