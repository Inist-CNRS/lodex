import { DEFAULT_TENANT } from '@lodex/common';

// also set by the e2e tests (cypress/support/index.ts), which drive the
// manual import screen
export const SITE_WIZARD_DISMISSED_KEY = 'lodex-site-wizard-dismissed';

const getKey = () =>
    `${SITE_WIZARD_DISMISSED_KEY}-${
        sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT
    }`;

// remembers, per instance and browser, that the user chose to configure
// the site manually: the wizard then no longer opens by itself
export const isSiteWizardDismissed = (): boolean => {
    try {
        return localStorage.getItem(getKey()) === 'true';
    } catch {
        return false;
    }
};

export const rememberSiteWizardDismissed = () => {
    try {
        localStorage.setItem(getKey(), 'true');
    } catch {
        // without storage, the wizard opens again on the next visit
    }
};
