import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const styles = {
    noFieldZone: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
    },
};

const NoFieldComponent = ({ label, addFieldButton }) => {
    return (
        <Box sx={styles.noFieldZone}>
            <div>
                <h2 style={{ color: '#888' }}>{label}</h2>
                {addFieldButton && <div>{addFieldButton}</div>}
            </div>
        </Box>
    );
};

NoFieldComponent.propTypes = {
    addFieldButton: PropTypes.node,
    label: PropTypes.string.isRequired,
};

export const NoField = translate(NoFieldComponent);
