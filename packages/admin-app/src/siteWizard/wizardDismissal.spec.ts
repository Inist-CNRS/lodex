import {
    forgetManualImportDismissal,
    isSiteWizardDismissed,
    rememberManualImportDismissal,
    rememberSiteWizardDismissed,
} from './wizardDismissal';

describe('wizardDismissal', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    it('dismisses the wizard during a manual import, until it fails', () => {
        rememberManualImportDismissal();
        expect(isSiteWizardDismissed()).toBe(true);

        forgetManualImportDismissal();
        expect(isSiteWizardDismissed()).toBe(false);
    });

    it('keeps the dismissal of the user when a manual import fails', () => {
        rememberSiteWizardDismissed();
        rememberManualImportDismissal();

        forgetManualImportDismissal();
        expect(isSiteWizardDismissed()).toBe(true);
    });

    it('keeps the dismissal of the user made during a manual import', () => {
        rememberManualImportDismissal();
        rememberSiteWizardDismissed();

        forgetManualImportDismissal();
        expect(isSiteWizardDismissed()).toBe(true);
    });
});
