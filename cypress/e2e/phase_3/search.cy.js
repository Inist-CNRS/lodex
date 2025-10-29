import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as fields from '../../support/fields';
import * as menu from '../../support/menu';
import * as searchDrawer from '../../support/searchDrawer';
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

            // Check that the export menu is open and contains menu items
            cy.get('[role="menu"]').should('be.visible');
            cy.get('[role="menuitem"]')
                .should('have.length.at.least', 1)
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

            searchDrawer.loadMore();
            searchDrawer.checkResultsCount(13);
            searchDrawer.checkMoreResultsNotExist();

            searchDrawer.search('bezoar');
            searchDrawer.clearSearch();

            searchDrawer.checkResultsCount(10);
            searchDrawer.checkMoreResultsCount(10, 13);

            searchDrawer.loadMore();
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
            cy.get('.property_value').should('be.visible');

            menu.openSearchDrawer();
            // Wait for search state to be restored from Redux
            cy.wait(400);

            searchDrawer.searchInput().should('have.value', query);
            searchDrawer.checkResultsCount(1);
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
            searchDrawer.checkResultsCount(10);

            // Apply first facet filter
            searchDrawer.setFacet('Première mise en ligne en', '1926');

            // Apply second facet filter
            searchDrawer.setFacet('Dernière mise en ligne en', '2013');

            // Verify both filters are applied by checking results are filtered
            searchDrawer.checkResultsCount(0); // Should have no results with both filters
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

            cy.findByRole('link', { name: 'More' }).click();
            cy.findByRole('link', { name: 'Admin' }).click();

            settings.disableMultilingual();
        });

        it.skip('should allow to sort facet', () => {
            menu.openSearchDrawer();
            searchDrawer.getFacet('Première mise en ligne en').click();
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

        it('should reset facets filter when clearing all facets', () => {
            menu.openSearchDrawer();

            // Apply filters to two facets
            searchDrawer.setFacet('Première mise en ligne en', '1926');
            searchDrawer.setFacet('Dernière mise en ligne en', '2013');

            // Clear all facets
            cy.findByRole('button', { name: 'Clear All' }).click();

            // Verify facets are reset, should return to original count
            searchDrawer.checkResultsCount(10);

            // Verify facets are available again
            searchDrawer.getFacet('Première mise en ligne en').click();
            cy.findByRole('checkbox', { name: '2011' }).should('exist');
        });

        it('should only reset the target facet filter when clearing one facet', () => {
            menu.openSearchDrawer();

            // Apply filters to two facets
            searchDrawer.setFacet('Première mise en ligne en', '1926');
            searchDrawer.setFacet('Dernière mise en ligne en', '2013');

            // Clear only the first facet
            searchDrawer.clearFacet('1926');

            // Verify only the first facet is cleared
            // The second facet should still be applied, so results should be filtered
            searchDrawer.checkResultsCount(1); // Should still have 1 result from 2013 filter
        });

        it('should allow to define default search order', () => {
            cy.findByRole('link', { name: 'More' }).click();
            cy.findByRole('link', { name: 'Admin' }).click();
            cy.findByRole('link', { name: 'Display' }).click();
            cy.findByRole('menuitem', { name: 'Search & Facets' }).click();

            cy.findByLabelText('Resource sort field').click();
            cy.findByRole('option', { name: /Première mise/ }).click();
            cy.waitForNetworkIdle(1000);

            cy.findByLabelText('Sort order').click();
            cy.findByRole('option', { name: /Descending/ }).should(
                'be.visible',
            );
            cy.findByRole('option', { name: /Descending/ }).click();

            datasetImportPage.goToPublishedResources();

            cy.findByRole('link', { name: 'Search' }).click();
            cy.findByRole('button', {
                name: 'Sort by Première mise en ligne en | Descending',
            })
                .should('be.visible')
                .click();
            cy.findByRole('menuitem', {
                name: 'Première mise en ligne en',
            }).should('have.attr', 'aria-current', 'true');
            cy.findByTestId('ArrowUpwardIcon').should('be.visible');
        });
    });

    describe('Visited Resources search', () => {
        beforeEach(initSearchDataset());
        it('should filter search results by visited resources', () => {
            menu.openSearchDrawer();
            cy.findByText('Sort | Ascending').click();
            cy.findByRole('menuitem', { name: 'Title' }).click();
            cy.waitForNetworkIdle(500);
            searchDrawer.checkResultsCount(10);

            // Test visited resources filter (should show 0 initially)
            searchDrawer.filterShowVisitedResources();
            searchDrawer.checkResultsCount(0);
            cy.get('body').should('contain.text', 'Aucune correspondance');

            // Test unvisited resources filter (should show all)
            searchDrawer.filterShowUnVisitedResources();
            searchDrawer.checkResultsCount(10);
            cy.findByText('13 ressources trouvées sur un total de 13').should(
                'exist',
            );

            // Visit a resource
            cy.findByTitle('Acupuncture in medicine').click();
            cy.waitForNetworkIdle(500);

            // Go back to search and verify counts changed
            menu.openSearchDrawer();
            cy.findByText('12 ressources trouvées sur un total de 13').should(
                'exist',
            );

            // Test visited resources filter (should show 1 now)
            searchDrawer.filterShowVisitedResources();
            searchDrawer.checkResultsCount(1);
            cy.findByText('1 ressources trouvées sur un total de 13').should(
                'exist',
            );

            searchDrawer.checkResultList(['Acupuncture in medicine']);
        });
    });
});
