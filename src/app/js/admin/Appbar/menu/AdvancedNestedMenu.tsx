import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { default as React } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'recompose';

import { toast } from '../../../../../common/tools/toast';
import { useTranslate } from '../../../i18n/I18NContext';
import jobsApi from '../../api/job';
import { fromParsing } from '../../selectors';
import { ExportDatasetButton } from '../../../public/export/ExportDatasetButton';

export const AdvancedNestedMenuComponent = React.memo(
    function AnnotationNestedMenu({
        // @ts-expect-error TS2339
        onClose,
        // @ts-expect-error TS2339
        showDatasetClearDialog,
        // @ts-expect-error TS2339
        hasLoadedDataset,
    }) {
        const { translate } = useTranslate();

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
                <ExportDatasetButton
                    key="export_raw_dataset"
                    onDone={() => onClose()}
                    disabled={!hasLoadedDataset}
                />
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

// @ts-expect-error TS2339
AdvancedNestedMenuComponent.propTypes = {
    onClose: PropTypes.func.isRequired,
    hasLoadedDataset: PropTypes.bool.isRequired,
    dumpDataset: PropTypes.func.isRequired,
    showDatasetClearDialog: PropTypes.func.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
});

export const AdvancedNestedMenu = compose(
    connect(mapStateToProps),
    withRouter,
)(AdvancedNestedMenuComponent);
