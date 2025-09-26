import AddBoxIcon from '@mui/icons-material/AddBox';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, Tooltip } from '@mui/material';
import {
    DataGrid,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import { default as React, useEffect } from 'react';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import { useHistory } from 'react-router';
// @ts-expect-error TS7016
import { Link } from 'react-router-dom';
import { launchAllEnrichment, retryEnrichment } from '.';
import { IN_PROGRESS } from '../../../../common/taskStatus';
import { toast } from '../../../../common/tools/toast';
import { useTranslate } from '../../i18n/I18NContext';
import { ConfirmPopup } from '../../lib/components/ConfirmPopup';
import EnrichmentStatus from './EnrichmentStatus';
import RunButton from './RunButton';

const EnrichmentListToolBar = ({
    // @ts-expect-error TS7031
    onLaunchAllEnrichment,
    // @ts-expect-error TS7031
    areEnrichmentsRunning,
}) => {
    const { translate } = useTranslate();
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
                onCancel={handleCloseDialog}
                onConfirm={handleLaunchAllEnrichment}
                title={translate('run_all_enrichment_modal_title')}
                description={translate('run_all_enrichment_modal_content')}
                confirmLabel={translate('run_all')}
                cancelLabel={translate('cancel')}
            />

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
                        onClick={handleOpenDialog}
                    >
                        {translate('run_all')}
                    </Button>
                </Tooltip>
            </GridToolbarContainer>
        </>
    );
};

EnrichmentListToolBar.propTypes = {
    onLaunchAllEnrichment: PropTypes.func,
    areEnrichmentsRunning: PropTypes.bool.isRequired,
};

export const EnrichmentList = ({
    // @ts-expect-error TS7031
    enrichments,
    // @ts-expect-error TS7031
    isLoadEnrichmentsPending,
    // @ts-expect-error TS7031
    isRunAllEnrichmentPending,
    // @ts-expect-error TS7031
    runAllEnrichmentError,
    // @ts-expect-error TS7031
    onLaunchAllEnrichment,
    // @ts-expect-error TS7031
    onRetryEnrichment,
}) => {
    const { translate } = useTranslate();
    const history = useHistory();
    const areEnrichmentsRunning =
        // @ts-expect-error TS7006
        enrichments.some((enrichment) => enrichment.status === IN_PROGRESS) ||
        isLoadEnrichmentsPending ||
        isRunAllEnrichmentPending;
    // @ts-expect-error TS7006
    const handleRowClick = (params) => {
        history.push(`/data/enrichment/${params.row._id}`);
    };

    useEffect(() => {
        if (!runAllEnrichmentError) {
            return;
        }

        toast(translate(runAllEnrichmentError), {
            type: toast.TYPE.ERROR,
        });
    }, [runAllEnrichmentError]);

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
                                    {/*
                                     // @ts-expect-error TS2554 */}
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
                // @ts-expect-error TS2322
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
    isLoadEnrichmentsPending: PropTypes.bool,
    isRunAllEnrichmentPending: PropTypes.bool,
    runAllEnrichmentError: PropTypes.string,
    onRetryEnrichment: PropTypes.func.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    enrichments: state.enrichment.enrichments,
    isLoadEnrichmentsPending: state.enrichment.isLoadEnrichmentsPending,
    isRunAllEnrichmentPending: state.enrichment.isRunAllEnrichmentPending,
    runAllEnrichmentError: state.enrichment.runAllEnrichmentError,
});

const mapDispatchToProps = {
    onLaunchAllEnrichment: launchAllEnrichment,
    onRetryEnrichment: retryEnrichment,
};

export default connect(mapStateToProps, mapDispatchToProps)(EnrichmentList);
