import { useEffect, useState } from 'react';
import compose from 'recompose/compose';
import FormSourceCodeField from '../../lib/components/FormSourceCodeField';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import { fromUpload } from '../selectors';
import {
    changeLoaderName,
    deleteCustomLoader,
    upsertCustomLoader,
} from './index';
import loaderApi from '../api/loader';
import CancelButton from '../../lib/components/CancelButton';
import { translate } from '../../i18n/I18NContext';
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
    p: {
        t: (key: string) => string;
    };
};

const CustomLoader = ({
    handleClose,
    isOpen,
    loaderName,
    onDeleteCustomLoader,
    onUpsertCustomLoader,
    onChangeLoaderName,
    initialValues,
    p: polyglot,
}: CustomLoaderProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const { control, setValue, getValues } = useForm<CustomLoaderFormData>({
        defaultValues: {
            customLoader: initialValues?.customLoader || '',
        },
        mode: 'onChange',
    });

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
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="xl">
            <DialogTitle>{polyglot.t('custom-loader')}</DialogTitle>
            <DialogContent>
                <Box display="flex">
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Controller
                            name="customLoader"
                            control={control}
                            render={({ field }) => (
                                <FormSourceCodeField
                                    input={field}
                                    label={polyglot.t('expand_rules')}
                                    height="350px"
                                    p={polyglot}
                                    dispatch={() => {}}
                                />
                            )}
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
                    {polyglot.t('remove')}
                </Button>
                <div>
                    <CancelButton onClick={handleClose}>
                        {polyglot.t('cancel')}
                    </CancelButton>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        variant="contained"
                    >
                        {polyglot.t('save')}
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
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

export default compose<CustomLoaderProps, CustomLoaderProps>(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(CustomLoader);
