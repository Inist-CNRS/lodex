import { DEFAULT_TENANT } from '@lodex/common';

// also set by the e2e tests (cypress/support/index.ts), which drive the
// manual import screen
export const SITE_WIZARD_DISMISSED_KEY = 'lodex-site-wizard-dismissed';

const getKey = () =>
    `${SITE_WIZARD_DISMISSED_KEY}-${
        sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT
    }`;

// what dismissed the wizard: the user, or a manual import, which a failure
// takes back (the instance stays empty)
const BY_USER = 'true';
const BY_MANUAL_IMPORT = 'import';

const read = () => {
    try {
        return localStorage.getItem(getKey());
    } catch {
        return null;
    }
};

const write = (value: string | null) => {
    try {
        if (value === null) {
            localStorage.removeItem(getKey());
        } else {
            localStorage.setItem(getKey(), value);
        }
    } catch {
        // without storage, the wizard opens again on the next visit
    }
};

// remembers, per instance and browser, that the user chose to configure
// the site manually (from the wizard or by a manual import): the wizard then
// no longer opens by itself
export const isSiteWizardDismissed = (): boolean =>
    read() === BY_USER || read() === BY_MANUAL_IMPORT;

export const rememberSiteWizardDismissed = () => write(BY_USER);

// a manual import is queued: the instance looks empty until its data is
// saved, and a reload meanwhile would open the wizard
export const rememberManualImportDismissal = () => {
    if (read() !== BY_USER) {
        write(BY_MANUAL_IMPORT);
    }
};

// an import failed or was cancelled: the instance stays empty, the wizard
// may help again, unless the user dismissed it
export const forgetManualImportDismissal = () => {
    if (read() === BY_MANUAL_IMPORT) {
        write(null);
    }
};
