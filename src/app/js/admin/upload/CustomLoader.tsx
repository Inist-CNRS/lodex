import React, { useEffect } from 'react';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
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
// @ts-expect-error TS7016
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { fromUpload } from '../selectors';
import {
    changeLoaderName,
    deleteCustomLoader,
    upsertCustomLoader,
} from './index';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import loaderApi from '../api/loader';
import CancelButton from '../../lib/components/CancelButton';
import { translate } from '../../i18n/I18NContext';

const CustomLoader = ({
    // @ts-expect-error TS7031
    formValue,
    // @ts-expect-error TS7031
    handleClose,
    // @ts-expect-error TS7031
    isOpen,
    // @ts-expect-error TS7031
    loaderName,
    // @ts-expect-error TS7031
    onDeleteCustomLoader,
    // @ts-expect-error TS7031
    onUpsertCustomLoader,
    // @ts-expect-error TS7031
    onChangeLoaderName,
    // @ts-expect-error TS7031
    p: polyglot,
}) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSave = () => {
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
            onUpsertCustomLoader(res.script);
            setIsLoading(false);
        };

        if (loaderName === 'custom-loader' || loaderName === 'automatic') {
            return;
        }
        if (isOpen) fetchLoaderWithScript();
    }, [isOpen, loaderName]);

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="xl">
            <DialogTitle>{polyglot.t('custom-loader')}</DialogTitle>
            <DialogContent>
                <Box display="flex">
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Field
                            name="customLoader"
                            component={FormSourceCodeField}
                            label={polyglot.t('expand_rules')}
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

const formSelector = formValueSelector('CUSTOM_LOADER_FORM');

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    formValue: formSelector(state, 'customLoader'),
    // @ts-expect-error TS2339
    initialValues: { customLoader: fromUpload.getCustomLoader(state) },
    // @ts-expect-error TS2339
    loaderName: fromUpload.getLoaderName(state),
});

const mapDispatchToProps = {
    onChangeLoaderName: changeLoaderName,
    onUpsertCustomLoader: upsertCustomLoader,
    onDeleteCustomLoader: deleteCustomLoader,
};

CustomLoader.propTypes = {
    formValue: PropTypes.string,
    handleClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    loaderName: PropTypes.string.isRequired,
    onUpsertCustomLoader: PropTypes.func.isRequired,
    onDeleteCustomLoader: PropTypes.func.isRequired,
    onChangeLoaderName: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: 'CUSTOM_LOADER_FORM',
        enableReinitialize: true,
    }),
)(CustomLoader);
