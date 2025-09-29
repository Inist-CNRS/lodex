// @ts-expect-error TS6133
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DEFAULT_TENANT } from '../../../../common/tools/tenantTools';
import { useTranslate } from '../../i18n/I18NContext';

const GoToPublicationButtonComponent = () => {
    const { translate } = useTranslate();
    const handleGoToPublication = () => {
        const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
        window.location.replace(window.location.origin + '/instance/' + tenant);
    };

    return (
        <Box display="flex" alignItems="center">
            <Tooltip title={translate(`navigate_to_published_data`)}>
                <IconButton
                    className="go-published-button"
                    onClick={handleGoToPublication}
                    // @ts-expect-error TS2769
                    color="contrast"
                >
                    <VisibilityIcon sx={{ fontSize: '30px' }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

GoToPublicationButtonComponent.propTypes = {};

export default GoToPublicationButtonComponent;
