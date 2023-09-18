import React from 'react';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { Box, IconButton, Tooltip } from '@mui/material';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import VisibilityIcon from '@mui/icons-material/Visibility';
import c from 'config';

const GoToPublicationButtonComponent = ({ p: polyglot }) => {
    const handleGoToPublication = () => {
        const tenant = sessionStorage.getItem('lodex-tenant') || 'default';
        window.location.replace(window.location.origin + '/instance/' + tenant);
    };

    return (
        <Box display="flex" alignItems="center">
            <Tooltip title={polyglot.t(`navigate_to_published_data`)}>
                <IconButton
                    className="go-published-button"
                    onClick={handleGoToPublication}
                    color="contrast"
                >
                    <VisibilityIcon sx={{ fontSize: '30px' }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

GoToPublicationButtonComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(GoToPublicationButtonComponent);
