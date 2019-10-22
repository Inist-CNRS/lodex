import { teardown, logoutAndLoginAs } from '../support/authentication';
import * as homePage from '../support/homePage';
import * as datasetImportPage from '../support/datasetImportPage';
import * as searchDrawer from '../support/searchDrawer';

describe('hiding null value to user', () => {
    const dataset = 'dataset/simple.csv';
    const model = 'model/simple.json';

    before(() => {
        teardown();
        homePage.openAdvancedDrawer();
        homePage.goToAdminDashboard();

        datasetImportPage.importDataset(dataset);
        datasetImportPage.importModel(model);
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    it('admin should be able hide field to user by setting it to null', () => {
        searchDrawer.openSearchDrawer();
        searchDrawer.goToResourceNumber(1);
        cy.get('.detail')
            .find('.property')
            .should('have.length', 2);

        cy.get('.column1 h3').contains('Row 1');
        cy.get('.column2').contains('Test 1');
        cy.get('.column2 .edit-field').click();

        cy.get('#field_form textarea[name=column2]').clear();
        cy.get('.edit-field.save').click();
        cy.get('.detail')
            .find('.property')
            .should('have.length', 2);

        logoutAndLoginAs('user');
        searchDrawer.openSearchDrawer();
        searchDrawer.goToResourceNumber(1);
        cy.get('.detail')
            .find('.property')
            .should('have.length', 1);

        cy.get('.column1').should('be.visible');
        cy.get('.column2').should('not.exist');
    });
});
