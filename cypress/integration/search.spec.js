import { teardown } from '../support/authentication';
import * as homePage from '../support/homePage';
import * as datasetImportPage from '../support/datasetImportPage';
import * as searchDrawer from '../support/searchDrawer';

describe('Search', () => {
    beforeEach(() => {
        teardown();
        homePage.goToAdminDashboard();

        datasetImportPage.importDataset('dataset/book_summary.csv');
        datasetImportPage.importModel('model/book_summary.json');
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    it('should have the right informations in the search results', () => {
        searchDrawer.openSearchDrawer();
        cy.get('.search-result').should('have.length', 10);
        cy.get('.drawer-container .load-more button').should('contain', '(2)');
    });

    it('should do a search, and its result redirect to a resource', () => {
        searchDrawer.openSearchDrawer();
        searchDrawer.search('Annals of the rheumatic');

        searchDrawer
            .findSearchResultByTitle('Annals of the rheumatic diseases')
            .click();

        cy.url().should('contain', '/uid');
        cy
            .get('.property_value')
            .contains('Annals of the rheumatic diseases')
            .should('be.visible');
    });

    it('should be able to load more search results', () => {
        searchDrawer.openSearchDrawer();
        cy.get('.search-result').should('have.length', 10);
        cy.get('.drawer-container .load-more button').should('contain', '(2)');

        searchDrawer.loadMore();

        cy.get('.search-result').should('have.length', 12);
        cy.get('.drawer-container .load-more button').should('not.be.visible');
    });
});
