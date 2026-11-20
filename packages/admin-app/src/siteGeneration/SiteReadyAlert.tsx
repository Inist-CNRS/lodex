import { Link } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { getPublishedSiteUrl } from '../Appbar/GoToPublicationButton';

// once the popup of a generated and published site is closed: where the site
// is, and where to customise it
export const SiteReadyAlert = ({ onClose }: { onClose: () => void }) => {
    const { translate } = useTranslate();
    return (
        <Alert
            severity="success"
            icon={<CelebrationIcon fontSize="inherit" />}
            onClose={onClose}
            closeText={translate('close')}
            sx={{ mb: 2, alignItems: 'center' }}
        >
            {translate('site_generation_online_notice')}
            <Button
                component="a"
                href={getPublishedSiteUrl()}
                target="_blank"
                rel="noopener"
                color="inherit"
                size="small"
                sx={{ ml: 2 }}
            >
                {translate('site_generation_view_site')}
            </Button>
            <Button component={Link} to="/display" color="inherit" size="small">
                {translate('display')}
            </Button>
        </Alert>
    );
};
