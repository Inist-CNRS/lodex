import { teardown, logoutAndLoginAs } from '../../support/authentication';
import * as menu from '../../support/menu';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as searchDrawer from '../../support/searchDrawer';
import * as adminNavigation from '../../support/adminNavigation';

describe('hiding null value to user', () => {
    const dataset = 'dataset/simple.csv';
    const model = 'model/simple.json';

    before(() => {
        teardown();
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();

        datasetImportPage.importDataset(dataset);
        datasetImportPage.importModel(model);
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    it('admin should be able hide field to user by setting it to null', () => {
        menu.openSearchDrawer();
        searchDrawer.goToResourceNumber(1);
        cy.get('.detail')
            .find('.property')
            .should('have.length', 2);

        cy.get('.column1 h3').contains('Row 1');
        cy.get('.column2').contains('Test 1');
        cy.get('.column2 [data-testid="SettingsIcon"]').should('exist');

        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();
        adminNavigation.goToDisplay();
        cy.get('.sidebar')
            .contains('Main resource')
            .click();

        cy.wait(1000);
        cy.get('.react-grid-item')
            .eq(1)
            .click(15, 40, { force: true });

        cy.get('#tab-display').click();
        cy.contains('Visible').click();
        cy.get('.btn-save').click();
        cy.get('.go-published-button', { timeout: 1000 }).click();

        logoutAndLoginAs('user');
        menu.openSearchDrawer();
        searchDrawer.goToResourceNumber(1);
        cy.get('.detail')
            .find('.property')
            .should('have.length', 1);

        cy.get('.column1').should('be.visible');
        cy.get('.column2').should('not.exist');
    });
});
