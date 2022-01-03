import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import AddFromDatasetIcon from './AddFromDatasetIcon';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { showAddFromColumn } from '../parsing';

const useStyles = makeStyles({
    containedButton: {
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
});

export const AddFieldFromColumnButtonComponent = ({
    onShowExistingColumns,
    p: polyglot,
}) => {
    const classes = useStyles();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onShowExistingColumns}
            className={classnames(
                classes.containedButton,
                'btn-add-field-from-dataset',
            )}
        >
            <AddFromDatasetIcon className={classes.icon} />
            {polyglot.t('from_original_dataset')}
        </Button>
    );
};

AddFieldFromColumnButtonComponent.propTypes = {
    onShowExistingColumns: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    scope: PropTypes.string,
};

const mapDispatchToProps = {
    onShowExistingColumns: showAddFromColumn,
};

export default compose(
    connect(null, mapDispatchToProps),
    translate,
)(AddFieldFromColumnButtonComponent);
