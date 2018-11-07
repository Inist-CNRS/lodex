import { teardown } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as homePage from '../support/homePage';
import * as graphPage from '../support/graphPage';

describe('Graph Page', () => {
    beforeEach(() => {
        teardown();
        homePage.goToAdminDashboard();
        datasetImportPage.importDataset('dataset/chart.csv');
        datasetImportPage.importModel('model/chart.json');
        datasetImportPage.publish();
        cy.visit('http://localhost:3000/graph');
    });

    it('should reset filters & search query when switching to another graph', () => {
        homePage.openChartDrawer();
        homePage.goToChart('Bar Chart');

        graphPage.searchFor('Biodiversity');
        graphPage.expectRowsCountToBe(5);
        graphPage.setFacet('Publication Year', '2011');
        graphPage.expectRowsCountToBe(4);

        homePage.openChartDrawer();
        homePage.goToChart('Bubble Chart');

        graphPage.getSearchInput().should('have.value', '');
        graphPage.getFacet('Publication Year').click();
        graphPage
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('not.be.checked');
    });
});
