import { teardown } from '../support/authentication';
import * as menu from '../support/menu';
import * as navigationPage from '../support/adminNavigation';
import * as datasetImportPage from '../support/datasetImportPage';
import * as subresourcePage from '../support/subresourceFormPage';

describe('Subresource Page', () => {
    const dataset = 'dataset/book_summary.csv';
    const model = 'model/book_summary.json';

    beforeEach(() => {
        teardown();
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();
        datasetImportPage.importDataset(dataset);
        datasetImportPage.importModel(model);
        navigationPage.goToDisplay();

        cy.get('.sidebar')
            .contains('a', 'Resource pages')
            .click();
    });

    it('should allow to add a subresource', () => {
        cy.contains('a', 'New subresource').click();

        cy.url().should('contain', '/display/document/add');

        subresourcePage.fillSubcategoryFormAndSubmit({
            name: 'Foo',
            identifier: 'Bar',
            path: 'Path',
        });

        cy.get('.sub-sidebar')
            .contains('Foo')
            .should('be.visible');

        cy.url().should('not.contain', '/display/document/add');
    });
});
