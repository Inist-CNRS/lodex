import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import FormSourceCodeField from '../../lib/components/FormSourceCodeField';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
} from '@material-ui/core';
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

const useStyles = makeStyles(() => {
    return {
        advancedRulesEditor: {
            display: 'flex',
            flex: '4 !important',
            height: '350px !important',
        },
    };
});

const CustomLoader = ({
    formValue,
    handleClose,
    isOpen,
    loaderName,
    onDeleteCustomLoader,
    onUpsertCustomLoader,
    onChangeLoaderName,
    p: polyglot,
}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const classes = useStyles();

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
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Field
                            name="customLoader"
                            component={FormSourceCodeField}
                            label={polyglot.t('expand_rules')}
                            className={classes.advancedRulesEditor}
                        />
                    )}
                </div>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'space-between' }}>
                <Button
                    onClick={handleDelete}
                    color="secondary"
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

const mapStateToProps = state => ({
    formValue: formSelector(state, 'customLoader'),
    initialValues: { customLoader: fromUpload.getCustomLoader(state) },
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
