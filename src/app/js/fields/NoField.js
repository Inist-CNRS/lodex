import React from 'react';
import { makeStyles } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    noFieldZone: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
    },
    addFieldButton: {
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
});

const NoFieldComponent = ({ label, addFieldButton }) => {
    const classes = useStyles();

    return (
        <div className={classes.noFieldZone}>
            <div>
                <h2 style={{ color: '#888' }}>{label}</h2>
                {addFieldButton && <div>{addFieldButton}</div>}
            </div>
        </div>
    );
};

NoFieldComponent.propTypes = {
    addFieldButton: PropTypes.node,
    label: PropTypes.string.isRequired,
};

export const NoField = translate(NoFieldComponent);
