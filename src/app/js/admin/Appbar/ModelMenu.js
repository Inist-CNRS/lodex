import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { Add as AddNewIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { withRouter } from 'react-router';

import AddFromDatasetIcon from './AddFromDatasetIcon';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { addField } from '../../fields';
import { showAddColumns } from '../parsing';

const useStyles = makeStyles({
    container: {
        textAlign: 'right',
        paddingBottom: 20,
        position: 'sticky',
        top: 0,
    },
    button: {
        color: 'black',
    },
    containedButton: {
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
});

export const ModelMenuComponent = ({
    handleAddNewColumn,
    handleShowExistingColumns,
    p: polyglot,
}) => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleShowExistingColumns}
                className={classnames(
                    classes.containedButton,
                    'btn-add-field-from-dataset',
                )}
            >
                <AddFromDatasetIcon className={classes.icon} />
                {polyglot.t('from_original_dataset')}
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddNewColumn}
                className={classnames(
                    classes.containedButton,
                    'btn-add-free-field',
                )}
            >
                <AddNewIcon className={classes.icon} />
                {polyglot.t('new_field')}
            </Button>
        </div>
    );
};

ModelMenuComponent.propTypes = {
    handleAddNewColumn: PropTypes.func.isRequired,
    handleShowExistingColumns: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = {
    handleAddNewColumn: name => addField({ name }),
    handleShowExistingColumns: showAddColumns,
};

export default compose(
    withRouter,
    connect(null, mapDispatchToProps),
    translate,
)(ModelMenuComponent);
