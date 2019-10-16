import { teardown, logoutAndLoginAs } from '../support/authentication';
import * as homePage from '../support/homePage';
import * as datasetImportPage from '../support/datasetImportPage';
import * as searchDrawer from '../support/searchDrawer';

describe('hiding null value to user', () => {
    beforeEach(teardown);
    it('admin should be able hide field to user by setting it to null', () => {
        homePage.openAdvancedDrawer();
        homePage.goToAdminDashboard();

        datasetImportPage.importDataset('dataset/simple.csv');
        datasetImportPage.importModel('model/simple.json');
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();

        searchDrawer.openSearchDrawer();
        searchDrawer.goToResourceNumber(1);
        cy.get('.detail')
            .find('.property')
            .should('have.length', 2);

        cy.get('.column1 h3').contains('Row 1');
        cy.get('.column2').contains('Test 1');
        cy.get('.column1 .edit-field').click();

        cy.get('#field_form input').clear();
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

        cy.get('.column1').should('not.exist');
        cy.get('.column2').should('be.visible');
    });
});
