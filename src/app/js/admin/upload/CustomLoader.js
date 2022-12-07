import React from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import FormSourceCodeField from '../../lib/components/FormSourceCodeField';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
} from '@material-ui/core';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { fromLoaders, fromUpload } from '../selectors';
import {
    changeLoaderName,
    deleteCustomLoader,
    upsertCustomLoader,
} from './index';
import { polyglot as polyglotPropTypes } from '../../propTypes';

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
    onDeleteCustomLoader,
    onUpsertCustomLoader,
    onChangeLoaderName,
    p: polyglot,
}) => {
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

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="xl">
            <DialogTitle>{polyglot.t('custom-loader')}</DialogTitle>
            <DialogContent>
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <Field
                        name="customLoader"
                        component={FormSourceCodeField}
                        label={polyglot.t('expand_rules')}
                        className={classes.advancedRulesEditor}
                    />
                </div>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'space-between' }}>
                <Button onClick={handleDelete} color="secondary">
                    {polyglot.t('remove')}
                </Button>
                <div>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        variant="contained"
                    >
                        {polyglot.t('save')}
                    </Button>
                    <Button onClick={handleClose} color="secondary">
                        {polyglot.t('cancel')}
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
    loaders: fromLoaders.getLoaders(state),
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
