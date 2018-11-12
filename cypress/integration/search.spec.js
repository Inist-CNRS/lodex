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
        cy.get('.loading').should('not.be.visible');
        cy.get('.property_value')
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

    it('should mark active resource on the result list', () => {
        searchDrawer.openSearchDrawer();
        searchDrawer.search('Annals of the rheumatic');

        searchDrawer
            .findSearchResultByTitle('Annals of the rheumatic diseases')
            .click();

        cy.url().should('contain', '/uid');
        cy.get('.loading').should('not.be.visible');
        searchDrawer.openSearchDrawer();

        cy.get('.search-result-link[class*=activeLink_]').should('exist');
    });

    it('should keep track of the current search after changing page', () => {
        const query = 'Annals of the rheumatic';
        searchDrawer.openSearchDrawer();
        searchDrawer.search(query);
        cy.get('.search-result').should('have.length', 1);

        searchDrawer
            .findSearchResultByTitle('Annals of the rheumatic diseases')
            .click();

        cy.url().should('contain', '/uid');
        cy.get('.loading').should('not.be.visible');
        searchDrawer.openSearchDrawer();

        cy.get('.search-result').should('have.length', 1);
        searchDrawer.searchInput().should('have.value', query);
    });

    describe('Advanced Search', () => {
        it('should filter search results by facets', () => {
            searchDrawer.openSearchDrawer();
            cy.get('.search-result').should('have.length', 10);

            searchDrawer.openAdvancedSearchDrawer();
            searchDrawer.setFacet('Dernière mise en ligne en', '2014');
            cy.get('.search-result').should('have.length', 1);
        });

        it('should allow to clear facets from the search results', () => {
            searchDrawer.openSearchDrawer();
            searchDrawer.openAdvancedSearchDrawer();
            searchDrawer.setFacet('Dernière mise en ligne en', '2014');
            cy.get('.search-result').should('have.length', 1);

            searchDrawer.openSearchDrawer();
            searchDrawer.clearFacet('2014');
            cy.get('.search-result').should('have.length', 10);
        });

        it('should allow to sort facet', () => {
            searchDrawer.openSearchDrawer();
            searchDrawer.openAdvancedSearchDrawer();
            searchDrawer.getFacet('Première mise en ligne en').click();
            searchDrawer.checkFacetsItem('Première mise en ligne en', [
                '2011',
                '1988',
                '2008',
                '1853',
                '1984',
                '1983',
                '2007',
                '1939',
                '1926',
                '2004',
            ]);
            searchDrawer.sortFacet('Première mise en ligne en', 'value');
            searchDrawer.checkFacetsItem('Première mise en ligne en', [
                '2011',
                '2008',
                '2007',
                '2004',
                '1988',
                '1984',
                '1983',
                '1939',
                '1926',
                '1853',
            ]);
            searchDrawer.sortFacet('Première mise en ligne en', 'value');
            searchDrawer.checkFacetsItem('Première mise en ligne en', [
                '1853',
                '1926',
                '1939',
                '1983',
                '1984',
                '1988',
                '2004',
                '2007',
                '2008',
                '2011',
            ]);
            searchDrawer.sortFacet('Première mise en ligne en', 'count');
            searchDrawer.checkFacetsItem('Première mise en ligne en', [
                '2011',
                '1988',
                '2008',
                '1853',
                '1984',
                '1983',
                '2007',
                '1939',
                '1926',
                '2004',
            ]);
            searchDrawer.sortFacet('Première mise en ligne en', 'count');
            searchDrawer.checkFacetsItem('Première mise en ligne en', [
                '2008',
                '1853',
                '1984',
                '1983',
                '2007',
                '1939',
                '1926',
                '2004',
                '2011',
                '1988',
            ]);
        });
    });
});
