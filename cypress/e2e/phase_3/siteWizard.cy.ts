import { teardown } from '../../support/authentication';
import * as menu from '../../support/menu';

const wizardTitle = () => cy.contains('Welcome to Lodex', { timeout: 15000 });

describe('Site wizard', () => {
    before(() => {
        // the other specs mark the wizard as dismissed (see support/index.ts)
        Cypress.env('SHOW_SITE_WIZARD', true);
    });

    after(() => {
        Cypress.env('SHOW_SITE_WIZARD', false);
    });

    beforeEach(() => {
        teardown();
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();
    });

    it('opens on an empty instance and leads to the manual configuration', () => {
        wizardTitle().should('be.visible');
        cy.contains('1/4').should('be.visible');

        cy.contains('button', 'Configure the site manually').click();
        cy.get('[role="dialog"]')
            .contains('button', /^confirm$/i)
            .click();

        cy.contains('Welcome to Lodex').should('not.exist');
        cy.get('.btn-upload-dataset').should('exist');
    });

    it('no longer opens by itself once dismissed, but from the import screen', () => {
        wizardTitle().should('be.visible');
        cy.contains('button', 'Configure the site manually').click();
        cy.get('[role="dialog"]')
            .contains('button', /^confirm$/i)
            .click();

        cy.reload();
        cy.get('.btn-upload-dataset', { timeout: 15000 }).should('exist');
        // the wizard would open once the loaders and fields are loaded
        cy.wait(3000);
        cy.contains('Welcome to Lodex').should('not.exist');

        cy.contains('button', 'Generate the site from a model').click();
        wizardTitle().should('be.visible');
    });
});
