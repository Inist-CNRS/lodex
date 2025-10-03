import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Dialog,
    TextField,
    DialogContent,
    DialogActions,
    DialogTitle,
} from '@mui/material';

import ButtonWithStatus from '../../lib/components/ButtonWithStatus';

import {
    clearDataset as clearDatasetAction,
    clearPublished as clearPublishedAction,
} from '../clear';

import { fromClear, fromPublication } from '../selectors';
import fieldApi from '../api/field';
import { toast } from '../../../../common/tools/toast';
import { loadField } from '../../fields';
import { loadPublication } from '../publication';
import CancelButton from '../../lib/components/CancelButton';
import { loadSubresources } from '../subresource';
import { extractTenantFromUrl } from '../../../../common/tools/tenantTools';
import { useTranslate } from '../../i18n/I18NContext';

const TRANSLATION_KEY = new Map([
    ['dataset', 'clear_dataset'],
    ['published', 'clear_publish'],
    ['model', 'clear_model'],
]);

// @ts-expect-error TS7006
const ClearDialogComponent = (props) => {
    const { translate } = useTranslate();
    const [validName, setValidName] = React.useState(false);
    const {
        type,
        onClose,
        isLoading,
        hasFailed,
        succeeded,
        loadField,
        loadSubResources,
        hasPublishedDataset,
    } = props;

    const instanceName = extractTenantFromUrl(window.location.href);

    useEffect(() => {
        if (succeeded) {
            if (type === 'dataset') {
                window.location.replace(
                    window.location.origin + '/admin#/data/existing',
                );
            }
            window.location.reload();
        }
    }, [succeeded, type]);

    // @ts-expect-error TS7006
    const handleChangeField = (e) => {
        setValidName(e.target.value === instanceName);
    };

    const handleClearDataset = () => {
        props.clearDataset();
    };

    const handleClearPublished = () => {
        props.clearPublished();
    };

    const handleClearModel = async () => {
        const result = await fieldApi.clearModel();
        if (result.message) {
            if (hasPublishedDataset) {
                props.clearPublished();
                props.loadPublication();
                loadSubResources();
            } else {
                loadField();
                loadSubResources();
                toast(translate('model_cleared'), {
                    type: toast.TYPE.SUCCESS,
                });
                onClose();
            }
        } else {
            toast(translate('model_not_cleared'), {
                type: toast.TYPE.ERROR,
            });
        }
    };

    // @ts-expect-error TS7006
    const handleClear = (type) =>
        (type === 'dataset' && handleClearDataset) ||
        (type === 'published' && handleClearPublished) ||
        (type === 'model' && handleClearModel);

    // @ts-expect-error TS7006
    const handleKeyPress = (e, type) => {
        if (e.key !== 'Enter' || !validName) {
            return null;
        }

        switch (type) {
            case 'dataset':
                return handleClearDataset();
            case 'published':
                return handleClearPublished();
            default:
                return null;
        }
    };
    const actions = [
        <CancelButton key="cancel" className="btn-cancel" onClick={onClose}>
            {translate('cancel')}
        </CancelButton>,
        <ButtonWithStatus
            raised
            key="submit"
            className="btn-save"
            onClick={handleClear(type)}
            color="primary"
            error={hasFailed}
            disabled={!validName}
            loading={isLoading}
            success={undefined}
            progress={undefined}
            target={undefined}
        >
            {translate('confirm')}
        </ButtonWithStatus>,
    ];

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>
                {TRANSLATION_KEY.get(type)
                    ? translate(TRANSLATION_KEY.get(type)!)
                    : ''}
            </DialogTitle>
            <DialogContent>
                <b>
                    {type === 'model'
                        ? translate('listen_up_model')
                        : translate('listen_up')}
                </b>
                <br />
                <br />
                <div>
                    {translate('enter_name')} :<b> {instanceName}</b>
                    <TextField
                        name="field-name-instance"
                        placeholder={translate('instance_name')}
                        fullWidth
                        onChange={handleChangeField}
                        onKeyPress={(e) => handleKeyPress(e, type)}
                        error={hasFailed && translate('error')}
                        variant="standard"
                    />
                </div>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

ClearDialogComponent.propTypes = {
    type: PropTypes.string.isRequired,
    succeeded: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    clearDataset: PropTypes.func.isRequired,
    clearPublished: PropTypes.func.isRequired,
    reloadParsing: PropTypes.func,
    isLoading: PropTypes.bool.isRequired,
    hasFailed: PropTypes.bool.isRequired,
    loadField: PropTypes.func.isRequired,
    loadPublication: PropTypes.func.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
    loadSubResources: PropTypes.func.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    succeeded: fromClear.hasClearSucceeded(state),
    hasFailed: fromClear.hasClearFailed(state),
    isLoading: fromClear.getIsLoading(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

const mapDispatchToProps = {
    clearDataset: clearDatasetAction,
    clearPublished: clearPublishedAction,
    loadField: loadField,
    loadPublication: loadPublication,
    loadSubResources: loadSubresources,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ClearDialogComponent);
