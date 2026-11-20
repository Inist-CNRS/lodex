import { Box, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DEFAULT_TENANT } from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

export const getPublishedSiteUrl = () =>
    `/instance/${sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT}`;

// the eye stands out in a ringed disc, from which a halo spreads. Without
// motion, the disc stays.
const HIGHLIGHT_SX = {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    outline: '2px solid currentColor',
    animation: 'lodex-published-halo 1.6s ease-out infinite',
    '@keyframes lodex-published-halo': {
        from: { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.8)' },
        to: { boxShadow: '0 0 0 16px rgba(255, 255, 255, 0)' },
    },
    '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
    },
};

const GoToPublicationButtonComponent = ({
    isHighlighted = false,
}: {
    // points at the site just generated
    isHighlighted?: boolean;
}) => {
    const { translate } = useTranslate();
    const handleGoToPublication = () => {
        window.location.replace(window.location.origin + getPublishedSiteUrl());
    };

    return (
        <Box display="flex" alignItems="center">
            <Tooltip title={translate(`navigate_to_published_data`)}>
                <IconButton
                    className="go-published-button"
                    onClick={handleGoToPublication}
                    // @ts-expect-error TS2769
                    color="contrast"
                    sx={isHighlighted ? HIGHLIGHT_SX : undefined}
                >
                    <VisibilityIcon sx={{ fontSize: '30px' }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default GoToPublicationButtonComponent;
