import { teardown } from '../../support/authentication';
import * as menu from '../../support/menu';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as searchDrawer from '../../support/searchDrawer';
import * as fields from '../../support/fields';
import * as settings from '../../support/settings';

const initSearchDataset =
    (dataset = 'dataset/book_summary.csv', model = 'model/book_summary.json') =>
    () => {
        teardown();
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();

        datasetImportPage.importDataset(dataset);
        datasetImportPage.importModel(model);
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    };

describe('Search', () => {
    describe('Basics', () => {
        beforeEach(initSearchDataset());

        it('should have the right information in the search results', () => {
            menu.openSearchDrawer();
            searchDrawer.checkResultsCount(10);
            searchDrawer.checkMoreResultsCount(10, 13);
        });

        it('should export the dataset', () => {
            menu.openSearchDrawer();
            searchDrawer.checkResultsCount(10);
            cy.get('.export').click();
            cy.wait(300);
            cy.get('.export-menuList  li[role="menuitem"]')
                .should('have.length', 2)
                .contains('CSV')
                .should('be.visible');
        });

        it('should do a search, and its result redirect to a resource', () => {
            menu.openSearchDrawer();
            searchDrawer.search('Annals of the rheumatic');

            searchDrawer
                .findSearchResultByTitle('Annals of the rheumatic diseases')
                .click();

            cy.url().should('contain', '/uid');
            cy.get('.loading').should('not.exist');
            cy.get('.property_value')
                .contains('Annals of the rheumatic diseases')
                .should('be.visible');
        });

        it('should be able to load more search results several times', () => {
            menu.openSearchDrawer();

            searchDrawer.checkStatsCount(13, 13);
            searchDrawer.checkResultsCount(10);
            searchDrawer.checkMoreResultsCount(10, 13);

            searchDrawer.loadMore(); // Call load more for the first time

            searchDrawer.checkResultsCount(13);
            searchDrawer.checkMoreResultsNotExist();

            searchDrawer.search('bezoar');
            searchDrawer.clearSearch();

            searchDrawer.checkResultsCount(10);
            searchDrawer.checkMoreResultsCount(10, 13);

            searchDrawer.loadMore(); // Call load more for the second time

            searchDrawer.checkResultsCount(13);
            searchDrawer.checkMoreResultsNotExist();
        });

        it('should mark active resource on the result list', () => {
            menu.openSearchDrawer();
            searchDrawer.search('Annals of the rheumatic');

            searchDrawer
                .findSearchResultByTitle('Annals of the rheumatic diseases')
                .click();

            cy.url().should('contain', '/uid');
            cy.get('.loading').should('not.exist');
            cy.wait(100);
            menu.openSearchDrawer();

            cy.get('.search-result-link[class*=activeLink_]').should('exist');
        });

        it('should keep track of the current search after changing page', () => {
            const query = 'Annals of the rheumatic';
            menu.openSearchDrawer();
            searchDrawer.search(query);
            searchDrawer.checkResultsCount(1);

            searchDrawer
                .findSearchResultByTitle('Annals of the rheumatic diseases')
                .click();

            cy.url().should('contain', '/uid');
            cy.get('.loading').should('not.exist');
            cy.wait(100);
            menu.openSearchDrawer();

            searchDrawer.checkResultsCount(1);
            searchDrawer.searchInput().should('have.value', query);
        });

        it.skip('should sort result by pertinence', () => {
            menu.openSearchDrawer();
            searchDrawer.search('medicine');
            searchDrawer.checkStatsCount(2, 13);
            searchDrawer.checkResultsCount(2);

            searchDrawer.checkResultList([
                'Acupuncture in medicine',
                'Archives of emergency medicine',
            ]);
            searchDrawer.search(' archive');
            searchDrawer.checkResultsCount(5);

            searchDrawer.checkResultList([
                'Archives of emergency medicine',
                'Acupuncture in medicine',
                'Archives of disease in childhood',
                'Archives of disease in childhood. Education and practice edition',
                'Archives of disease in childhood. Fetal and neonatal edition',
            ]);
        });
    });

    describe('Advanced Search', () => {
        beforeEach(initSearchDataset());

        it('should filter search results by facets', () => {
            menu.openSearchDrawer();
            searchDrawer.checkResultsCount(10);

            searchDrawer.setFacet('Dernière mise en ligne en', '2014');
            searchDrawer.checkResultsCount(1);
        });

        it('should allow to clear facets from the search results', () => {
            menu.openSearchDrawer();
            searchDrawer.setFacet('Dernière mise en ligne en', '2014');
            searchDrawer.checkResultsCount(1);

            searchDrawer.clearFacet('2014');
            searchDrawer.checkResultsCount(10);
        });

        it('should allow to filter search results by multiple facets', () => {
            menu.openSearchDrawer();
            searchDrawer.getFacet('Première mise en ligne en').click();
            cy.wait(500);
            cy.get('[data-testid="ChevronRightIcon"]').click();

            searchDrawer.filterFacet('Première mise en ligne en', '1926');
        });

        it('should only show facets that are available on user language', () => {
            menu.openSearchDrawer();

            cy.contains('Première mise en ligne').should('exist');
            cy.contains('Dernière mise en ligne').should('exist');
            cy.contains('Couverture').should('exist');
            cy.contains('Editeur').should('exist');
            cy.contains('Type').should('exist');

            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();

            settings.enableMultilingual();

            cy.get('[href="#/display"] > :nth-child(2)').click();
            cy.get('[href="#/display/document/main"]').click();

            fields.setFieldLanguage('Type', 'fr');

            datasetImportPage.goToPublishedResources();
            menu.openSearchDrawer();

            cy.contains('Première mise en ligne').should('exist');
            cy.contains('Dernière mise en ligne').should('exist');
            cy.contains('Couverture').should('exist');
            cy.contains('Editeur').should('exist');
            cy.contains('Type').should('not.exist');
        });

        it.skip('should allow to sort facet', () => {
            menu.openSearchDrawer();
            searchDrawer.getFacet('Première mise en ligne en').click();
            cy.wait(500);
            searchDrawer.checkFacetsItem('Première mise en ligne en (10)', [
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

            searchDrawer.checkFacetsItem('Première mise en ligne en (10)', [
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
            searchDrawer.sortFacet('Première mise en ligne en (10)', 'value');
            searchDrawer.checkFacetsItem('Première mise en ligne en (10)', [
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
            searchDrawer.sortFacet('Première mise en ligne en (10)', 'count');
            searchDrawer.checkFacetsItem('Première mise en ligne en (10)', [
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
            searchDrawer.sortFacet('Première mise en ligne en (10)', 'count');
            searchDrawer.checkFacetsItem('Première mise en ligne en (10)', [
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

    // @TODO Investigate why this test fails (due to publication of exotic-search-dataset)
    // describe('Edge Cases', () => {
    //     beforeEach(
    //         initSearchDataset(
    //             'dataset/exotic-search-dataset.csv',
    //             'model/exotic-search-model.json',
    //         ),
    //     );

    //     it('should have a diacritic insensible text-based search', () => {
    //         menu.openSearchDrawer();
    //         searchDrawer.search('sirene');
    //         searchDrawer.checkResultsCount(1);
    //     });

    //     it('should allow to search for long sentences or descriptions', () => {
    //         menu.openSearchDrawer();
    //         searchDrawer.search('Lorem ipsum');
    //         searchDrawer.checkResultsCount(1);
    //     });
    // });
});
