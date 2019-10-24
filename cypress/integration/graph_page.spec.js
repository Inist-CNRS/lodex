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

    it('should reset filters & search query when switching to another graph', () => {
        homePage.openAdvancedDrawer();
        homePage.openChartDrawer();

        homePage.goToChart('Bar Chart');
        graphPage.getStats().should('have.text', 'Found 50 on 50');

        graphPage.searchFor('Biodiversity');
        graphPage.getStats().should('have.text', 'Found 5 on 50');

        graphPage.setFacet('Publication Year', '2011');
        graphPage.getStats().should('have.text', 'Found 4 on 50');

        homePage.openAdvancedDrawer();
        homePage.openChartDrawer();
        homePage.goToChart('Bubble Chart');

        graphPage.getSearchInput().should('have.value', '');
        graphPage.getStats().should('have.text', 'Found 50 on 50');

        graphPage.getFacet('Publication Year').click();
        graphPage
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('not.be.checked');
    });

    it('should copy filters to search drawer', () => {
        homePage.openAdvancedDrawer();
        homePage.openChartDrawer();

        homePage.goToChart('Bar Chart');

        graphPage.setFacet('Publication Year', '2011');
        graphPage.getStats().should('have.text', 'Found 21 on 50');

        searchDrawer.openSearchDrawer();
        searchDrawer.getFacet('Publication Year').click();
        searchDrawer
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('not.checked');

        searchDrawer.closeSearchDrawer();
        graphPage.browseResults();

        searchDrawer.getFacet('Publication Year').click();
        searchDrawer
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('checked');
    });
});
