import { teardown } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as menu from '../support/menu';
import * as graphPage from '../support/graphPage';
import * as searchDrawer from '../support/searchDrawer';

describe('Graph Page', () => {
    beforeEach(() => {
        teardown();
        cy.setCookie('lodex_tenant', 'lodex_test_graph_page');
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();

        datasetImportPage.importDataset('dataset/chart.csv');
        datasetImportPage.importModel('model/chart.json');
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    it('should not reset the facets and the search query when switching to another graph', () => {
        menu.openChartDrawer();
        menu.goToChart('Bar Chart');

        graphPage.getStats().should('have.text', 'Found 50 on 50');

        graphPage.searchFor('Biodiversity');
        graphPage.getStats().should('have.text', 'Found 5 on 50');

        graphPage.clearSearch();
        graphPage.getStats().should('have.text', 'Found 5 on 50');

        graphPage.searchFor('Biodiversity');
        graphPage.setFacet('Publication Year', '2011');
        cy.wait(400);
        graphPage.getStats().should('have.text', 'Found 4 on 50');

        menu.openChartDrawer();
        menu.goToChart('Bubble Chart');

        graphPage.getSearchInput().should('have.value', 'Biodiversity');
        graphPage.getStats().should('have.text', 'Found 4 on 50');

        graphPage.getFacet('Publication Year').click();
        cy.wait(500);
        graphPage
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('be.checked');
    });

    it('should copy filters to search drawer', () => {
        menu.openChartDrawer();
        menu.goToChart('Bar Chart');

        graphPage.searchFor('Biodiversity');
        graphPage.getStats().should('have.text', 'Found 5 on 50');
        graphPage.setFacet('Publication Year', '2011');
        graphPage.getStats().should('have.text', 'Found 4 on 50');

        menu.openSearchDrawer();
        searchDrawer.getFacet('Publication Year').click();
        searchDrawer
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('not.checked');
        searchDrawer.searchInput().should('have.value', '');

        menu.closeSearchDrawer();
        graphPage.browseResults();

        searchDrawer.getFacet('Publication Year').click();
        searchDrawer.searchInput().should('have.value', 'Biodiversity');
        searchDrawer
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('checked');

        menu.closeSearchDrawer();
        graphPage.setFacetExclude('Publication Year');
        graphPage.browseResults();
        searchDrawer.getFacet('Publication Year (14)').click();
        searchDrawer.searchInput().should('have.value', 'Biodiversity');
        searchDrawer
            .getFacetExcludeItem('Publication Year')
            .find('input[type=checkbox]')
            .should('checked');
    });
});
