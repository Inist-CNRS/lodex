import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../propTypes';
import SelectDatasetField from '../fields/wizard/SelectDatasetField';
import { addField } from '../fields';

export const AddFromColumnDialogComponent = ({
    p: polyglot,
    onClose,
    handleAddColumn,
}) => {
    const [selectedField, setSelectedField] = useState(null);
    const handleOnClick = () => {
        if (selectedField) {
            handleAddColumn(selectedField);
            onClose();
        }
    };

    const handleSelectChange = value => {
        setSelectedField(value);
    };

    return (
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle> {polyglot.t('a_column')}</DialogTitle>
            <DialogContent>
                <SelectDatasetField
                    handleChange={handleSelectChange}
                    label="select_a_column"
                    column={selectedField}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleOnClick}
                    className={classnames('btn-add-field-from-column')}
                >
                    {polyglot.t('Accept')}
                </Button>
                <Button color="secondary" variant="text" onClick={onClose}>
                    {polyglot.t('Cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddFromColumnDialogComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    onClose: PropTypes.func.isRequired,
    handleAddColumn: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
    handleAddColumn: name => addField({ name }),
};

export default compose(
    connect(undefined, mapDispatchToProps),
    translate,
)(AddFromColumnDialogComponent);
