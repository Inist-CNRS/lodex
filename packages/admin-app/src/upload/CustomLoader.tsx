import { useEffect, useState } from 'react';
import compose from 'recompose/compose';
import FormSourceCodeField from '../../../../src/app/js/lib/components/FormSourceCodeField';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { fromUpload } from '../selectors';
import {
    changeLoaderName,
    deleteCustomLoader,
    upsertCustomLoader,
} from './index';
import loaderApi from '../api/loader';
import CancelButton from '../../../../src/app/js/lib/components/CancelButton';
import {
    translate,
    useTranslate,
} from '@lodex/frontend-common/i18n/I18NContext';
import type { State } from '../reducers';

type CustomLoaderFormData = {
    customLoader: string;
};

type CustomLoaderProps = {
    handleClose: () => void;
    isOpen: boolean;
    loaderName: string;
    onDeleteCustomLoader: () => void;
    onUpsertCustomLoader: (loader: string) => void;
    onChangeLoaderName: (name: string) => void;
    initialValues: { customLoader: string };
};

const CustomLoader = ({
    handleClose,
    isOpen,
    loaderName,
    onDeleteCustomLoader,
    onUpsertCustomLoader,
    onChangeLoaderName,
    initialValues,
}: CustomLoaderProps) => {
    const { translate } = useTranslate();
    const [isLoading, setIsLoading] = useState(false);

    const formMethods = useForm<CustomLoaderFormData>({
        defaultValues: {
            customLoader: initialValues?.customLoader || '',
        },
        mode: 'onChange',
    });
    const { setValue, getValues } = formMethods;

    const handleSave = () => {
        const formValue = getValues('customLoader');
        onUpsertCustomLoader(formValue);
        onChangeLoaderName('custom-loader');
        handleClose();
    };

    const handleDelete = () => {
        onDeleteCustomLoader();
        onChangeLoaderName('automatic');
        handleClose();
    };

    useEffect(() => {
        const fetchLoaderWithScript = async () => {
            setIsLoading(true);
            const res = await loaderApi.getLoaderWithScript({
                name: loaderName,
            });
            setValue('customLoader', res.script);
            setIsLoading(false);
        };

        if (loaderName === 'custom-loader' || loaderName === 'automatic') {
            return;
        }
        if (isOpen) fetchLoaderWithScript();
    }, [isOpen, loaderName, setValue]);

    return (
        <FormProvider {...formMethods}>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                scroll="body"
                maxWidth="xl"
            >
                <DialogTitle>{translate('custom-loader')}</DialogTitle>
                <DialogContent>
                    <Box display="flex">
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <FormSourceCodeField
                                name="customLoader"
                                label={translate('expand_rules')}
                                height="350px"
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'space-between' }}>
                    <Button
                        onClick={handleDelete}
                        color="warning"
                        variant="contained"
                    >
                        {translate('remove')}
                    </Button>
                    <div>
                        <CancelButton onClick={handleClose}>
                            {translate('cancel')}
                        </CancelButton>
                        <Button
                            onClick={handleSave}
                            color="primary"
                            variant="contained"
                        >
                            {translate('save')}
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </FormProvider>
    );
};

const mapStateToProps = (state: State) => ({
    initialValues: { customLoader: fromUpload.getCustomLoader(state) },
    loaderName: fromUpload.getLoaderName(state),
});

const mapDispatchToProps = {
    onChangeLoaderName: changeLoaderName,
    onUpsertCustomLoader: upsertCustomLoader,
    onDeleteCustomLoader: deleteCustomLoader,
};

export default compose<
    CustomLoaderProps,
    Omit<
        CustomLoaderProps,
        | 'onChangeLoaderName'
        | 'onUpsertCustomLoader'
        | 'onDeleteCustomLoader'
        | 'loaderName'
        | 'initialValues'
    >
>(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(CustomLoader);
