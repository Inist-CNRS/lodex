import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { showAddColumns } from '../parsing';
import { AddFieldButton } from './AddFieldButton';
import AddFieldFromColumnButton from './AddFieldFromColumnButton';

const useStyles = makeStyles({
    container: {
        textAlign: 'right',
        paddingBottom: 20,
        position: 'sticky',
        width: '100%',
        top: 0,
    },
    button: {
        color: 'black',
    },
});

export const ModelMenuComponent = ({ showAddColumnButton = true }) => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            {showAddColumnButton && <AddFieldFromColumnButton />}
            <AddFieldButton />
        </div>
    );
};

ModelMenuComponent.propTypes = {
    showAddColumnButton: PropTypes.bool,
};

const mapDispatchToProps = {
    onShowExistingColumns: showAddColumns,
};

export default connect(null, mapDispatchToProps)(ModelMenuComponent);
