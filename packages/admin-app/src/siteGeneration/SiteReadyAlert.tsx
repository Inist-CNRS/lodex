import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import type { SharedState } from '@lodex/frontend-common/sharedReducers';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import { getPublishedSiteUrl } from '../Appbar/GoToPublicationButton';
import type { State } from '../reducers';
import { fromPublication } from '../selectors';

// once the popup of a generated and published site is closed: where the site
// is, and where to customise it
export const SiteReadyAlert = ({ onClose }: { onClose: () => void }) => {
    const { translate } = useTranslate();
    // as the eye of the app bar: nothing once the site is unpublished or the
    // admin signed out
    const isSiteOnline = useSelector(
        (state: State & SharedState) =>
            fromUser.isAdmin(state) &&
            fromPublication.hasPublishedDataset(state),
    );
    // closed for good once the site goes offline: it must not come back at the
    // next sign-in or publication. Not while it was never online: the
    // publication may still be loading when the popup closes
    const wasSiteOnline = useRef(isSiteOnline);
    useEffect(() => {
        if (wasSiteOnline.current && !isSiteOnline) {
            onClose();
        }
        wasSiteOnline.current = isSiteOnline;
    }, [isSiteOnline, onClose]);
    if (!isSiteOnline) {
        return null;
    }
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
