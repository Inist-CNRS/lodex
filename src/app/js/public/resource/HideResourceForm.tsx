import { useDispatch, useSelector } from 'react-redux';
import { useTranslate } from '../../i18n/I18NContext';

import { fromResource } from '../selectors';
import { FormProvider, useForm } from 'react-hook-form';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { TextField } from '../../reactHookFormFields/TextField';
import CancelButton from '../../lib/components/CancelButton';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import { hideResource } from '../api/hideResource';
import { hideResourceSuccess } from '.';
import { useState } from 'react';
import Alert from '../../lib/components/Alert';

type HideResourceFormComponentProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const HideResourceForm = ({
    isOpen,
    onClose,
}: HideResourceFormComponentProps) => {
    const { translate } = useTranslate();
    const [resourceError, setResourceError] = useState<string | null>(null);
    const formMethods = useForm<{ reason: string }>({
        reValidateMode: 'onChange',
    });
    const resource = useSelector(fromResource.getResourceLastVersion);
    const dispatch = useDispatch();

    const onSubmit = async ({ reason }: { reason: string }) => {
        const result = await hideResource({
            uri: resource.uri,
            reason,
        }).catch((error) => ({ error }));

        const { response, error } = result;

        if (error) {
            setResourceError(error.message);
            return;
        }

        if (response) {
            // update the resource data in the redux store
            dispatch(hideResourceSuccess(response));
        }

        onClose();
    };

    const { handleSubmit, formState } = formMethods;

    return (
        <FormProvider {...formMethods}>
            <Dialog
                open={isOpen}
                scroll="body"
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{translate('hide')}</DialogTitle>
                <form id="hide_resource_form" onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        {resourceError && (
                            <Alert>
                                <p>{resourceError}</p>
                            </Alert>
                        )}
                        <TextField
                            name="reason"
                            label={translate('enter_reason')}
                            fullWidth
                            multiline
                            variant="standard"
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <CancelButton key="cancel" onClick={onClose}>
                            {translate('cancel')}
                        </CancelButton>
                        <ButtonWithStatus
                            raised
                            key="save"
                            className={'save'}
                            color="primary"
                            type="submit"
                            loading={formState.isSubmitting}
                            error={undefined}
                            disabled={undefined}
                            success={undefined}
                            progress={undefined}
                            target={undefined}
                        >
                            {translate('save')}
                        </ButtonWithStatus>
                    </DialogActions>
                </form>
            </Dialog>
        </FormProvider>
    );
};
