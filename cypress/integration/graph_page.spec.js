import { teardown } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as homePage from '../support/homePage';
import * as graphPage from '../support/graphPage';
import * as searchDrawer from '../support/searchDrawer';

describe('Graph Page', () => {
    beforeEach(() => {
        teardown();
        homePage.openAdvancedDrawer();
        homePage.goToAdminDashboard();

        datasetImportPage.importDataset('dataset/chart.csv');
        datasetImportPage.importModel('model/chart.json');
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    it('should not reset filters & search query when switching to another graph', () => {
        homePage.openChartDrawer();

        homePage.goToChart('Bar Chart');
        graphPage.getStats().should('have.text', 'Found 50 on 50');

        graphPage.searchFor('Biodiversity');
        graphPage.getStats().should('have.text', 'Found 5 on 50');

        graphPage.setFacet('Publication Year', '2011');
        graphPage.getStats().should('have.text', 'Found 4 on 50');

        homePage.openAdvancedDrawer();
        homePage.goToChart('Bubble Chart');

        graphPage.getSearchInput().should('have.value', 'Biodiversity');
        graphPage.getStats().should('have.text', 'Found 4 on 50');

        graphPage.getFacet('Publication Year').click();
        graphPage
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('be.checked');
    });

    it('should copy filters to search drawer', () => {
        homePage.openChartDrawer();

        homePage.goToChart('Bar Chart');

        graphPage.searchFor('Biodiversity');
        graphPage.getStats().should('have.text', 'Found 5 on 50');
        graphPage.setFacet('Publication Year', '2011');
        graphPage.getStats().should('have.text', 'Found 4 on 50');

        searchDrawer.openSearchDrawer();
        searchDrawer.getFacet('Publication Year').click();
        searchDrawer
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('not.checked');
        searchDrawer.searchInput().should('have.value', '');

        searchDrawer.closeSearchDrawer();
        graphPage.browseResults();

        searchDrawer.getFacet('Publication Year').click();
        searchDrawer.searchInput().should('have.value', 'Biodiversity');
        searchDrawer
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('checked');

        searchDrawer.closeSearchDrawer();
        graphPage.setFacetExclude('Publication Year');
        graphPage.browseResults();
        searchDrawer.getFacet('Publication Year').click();
        searchDrawer.searchInput().should('have.value', 'Biodiversity');
        searchDrawer
            .getFacetExcludeItem('Publication Year')
            .find('input[type=checkbox]')
            .should('checked');
    });
});
