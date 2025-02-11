import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import StorageIcon from '@mui/icons-material/Storage';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { default as React } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';

import { toast } from '../../../../../common/tools/toast';
import { useTranslate } from '../../../i18n/I18NContext';
import jobsApi from '../../api/job';
import { dumpDataset } from '../../dump';
import { fromParsing } from '../../selectors';

export const AdvancedNestedMenuComponent = React.memo(
    function AnnotationNestedMenu({
        onClose,
        showDatasetClearDialog,
        dumpDataset,
        hasLoadedDataset,
    }) {
        const { translate } = useTranslate();

        const handleExportDataset = () => {
            onClose(dumpDataset);
        };

        const handleClearJobs = async () => {
            const result = await jobsApi.clearJobs();
            if (result.response.status === 'success') {
                toast(translate('jobs_cleared'), {
                    type: toast.TYPE.SUCCESS,
                });
            }
            onClose();
        };

        return (
            <>
                <MenuItem
                    key="export_raw_dataset"
                    onClick={handleExportDataset}
                    disabled={!hasLoadedDataset}
                >
                    <ListItemIcon>
                        <StorageIcon />
                    </ListItemIcon>
                    <ListItemText primary={translate('export_raw_dataset')} />
                </MenuItem>
                <MenuItem
                    key="clear_dataset"
                    onClick={showDatasetClearDialog}
                    disabled={!hasLoadedDataset}
                >
                    <ListItemIcon>
                        <ClearAllIcon />
                    </ListItemIcon>
                    <ListItemText primary={translate('clear_dataset')} />
                </MenuItem>
                <MenuItem key="clear_jobs" onClick={handleClearJobs}>
                    <ListItemIcon>
                        <DeleteSweepIcon />
                    </ListItemIcon>
                    <ListItemText primary={translate('clear_jobs')} />
                </MenuItem>
            </>
        );
    },
);

AdvancedNestedMenuComponent.propTypes = {
    onClose: PropTypes.func.isRequired,
    hasLoadedDataset: PropTypes.bool.isRequired,
    dumpDataset: PropTypes.func.isRequired,
    showDatasetClearDialog: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            dumpDataset,
        },
        dispatch,
    );

const mapStateToProps = (state) => ({
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
});

export const AdvancedNestedMenu = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter,
)(AdvancedNestedMenuComponent);
