import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { Add as AddNewIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { addField } from '../../fields';

const useStyles = makeStyles({
    containedButton: {
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
});

const AddFieldButtonComponent = ({ onAddNewField, p: polyglot, name }) => {
    const classes = useStyles();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={() => onAddNewField(name)}
            className={classnames(
                classes.containedButton,
                'btn-add-free-field',
            )}
        >
            <AddNewIcon className={classes.icon} />
            {polyglot.t('new_field')}
        </Button>
    );
};

AddFieldButtonComponent.propTypes = {
    onAddNewField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    name: PropTypes.string,
};

const mapDispatchToProps = {
    onAddNewField: addField,
};

export const AddFieldButton = compose(
    connect(null, mapDispatchToProps),
    translate,
)(AddFieldButtonComponent);
