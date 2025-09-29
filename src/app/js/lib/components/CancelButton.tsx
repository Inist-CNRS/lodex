// @ts-expect-error TS6133
import React from 'react';
import { styled } from '@mui/material/styles';
import MuiButton from '@mui/material/Button';

const Button = styled(MuiButton)(({ theme }) => {
    return {
        color: theme.palette.grey[600],
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
        },
    };
});

// @ts-expect-error TS7006
const CancelButton = (props) => {
    return <Button disableRipple {...props} />;
};

export default CancelButton;
