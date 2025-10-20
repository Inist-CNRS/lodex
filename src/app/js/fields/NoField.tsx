import React from 'react';
import { Box } from '@mui/material';
import { translate } from '../i18n/I18NContext';

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

interface NoFieldComponentProps {
    addFieldButton?: React.ReactNode;
    label: string;
}

const NoFieldComponent = ({
    label,
    addFieldButton
}: NoFieldComponentProps) => {
    return (
        <Box sx={styles.noFieldZone}>
            <div>
                <h2 style={{ color: '#888' }}>{label}</h2>
                {addFieldButton && <div>{addFieldButton}</div>}
            </div>
        </Box>
    );
};

export const NoField = translate(NoFieldComponent);
