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
import Alert from '../../lib/components/Alert';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

type HideResourceFormComponentProps = {
    isOpen: boolean;
    onClose: () => void;
};

const useHideResource = ({
    uri,
    onClose,
}: {
    uri: string;
    onClose: () => void;
}): {
    hideResource: (data: { reason: string }) => void;
    error: Error | null;
    isLoading: boolean;
} => {
    const { translate } = useTranslate();
    const dispatch = useDispatch();
    const { mutate, error, isLoading } = useMutation<
        {
            reason: string;
            removedAt: string;
        },
        Error,
        { reason: string }
    >({
        mutationFn: async ({ reason }: { reason: string }) => {
            return hideResource({ uri, reason });
        },
        onSuccess(response) {
            // update the resource data in the redux store
            dispatch(
                hideResourceSuccess({
                    uri,
                    ...response,
                }),
            );

            toast(translate('resource_hide_success'), {
                type: toast.TYPE.SUCCESS,
            });

            onClose();
        },
    });

    return { hideResource: mutate, error, isLoading };
};

export const HideResourceForm = ({
    isOpen,
    onClose,
}: HideResourceFormComponentProps) => {
    const { translate } = useTranslate();
    const formMethods = useForm<{ reason: string }>({
        reValidateMode: 'onChange',
    });
    const resource = useSelector(fromResource.getResourceLastVersion);

    const { hideResource, error, isLoading } = useHideResource({
        uri: resource.uri,
        onClose,
    });

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
                <form
                    id="hide_resource_form"
                    onSubmit={handleSubmit(hideResource)}
                >
                    <DialogContent>
                        {error && (
                            <Alert>
                                <p>{error.message}</p>
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
                            loading={formState.isSubmitting || isLoading}
                            error={undefined}
                            disabled={
                                formState.isSubmitting || !formState.isValid
                            }
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
