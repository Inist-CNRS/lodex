import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { Add as AddNewIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { useParams } from 'react-router';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { addField } from '../../fields';
import { fromFields } from '../../sharedSelectors';

const useStyles = makeStyles({
    containedButton: {
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
});

export const AddFieldButtonComponent = ({
    onAddNewField,
    p: polyglot,
    isFieldsLoading,
}) => {
    const classes = useStyles();
    const { filter } = useParams();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
                onAddNewField({ scope: filter });
            }}
            className={classnames(
                classes.containedButton,
                'btn-add-free-field',
            )}
            disabled={isFieldsLoading}
        >
            <AddNewIcon className={classes.icon} />
            {polyglot.t('new_field')}
        </Button>
    );
};

AddFieldButtonComponent.propTypes = {
    onAddNewField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    isFieldsLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
    isFieldsLoading: fromFields.isLoading(state),
});

const mapDispatchToProps = {
    onAddNewField: addField,
};

export const AddFieldButton = compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(AddFieldButtonComponent);
