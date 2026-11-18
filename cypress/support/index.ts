import 'cypress-network-idle';
import 'cypress-file-upload';
import './commands';

// The site wizard opens by itself on the empty instance of each test and
// covers the manual import screen that the tests drive: mark it as dismissed
// (see packages/admin-app/src/siteWizard/wizardDismissal.ts), unless a spec
// tests the wizard itself.
Cypress.on('window:before:load', (win) => {
    if (!Cypress.env('SHOW_SITE_WIZARD')) {
        win.localStorage.setItem('lodex-site-wizard-dismissed-default', 'true');
    }
});
