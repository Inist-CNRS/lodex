import * as path from 'path';
import { getExportDateFormat } from '../../../packages/frontend-common/formats/utils/components/useVegaCsvExport';
import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as graphPage from '../../support/graphPage';
import * as menu from '../../support/menu';
import * as searchDrawer from '../../support/searchDrawer';
import * as browseResultDrawer from '../../support/browseResultDrawer';

describe('Graph Page', () => {
    beforeEach(() => {
        // ResizeObserver doesn't like when the app has to many renders / re-renders
        // and throws an exception to say, "I wait for the next paint"
        // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors
        cy.on('uncaught:exception', (error) => {
            return !error.message.includes('ResizeObserver');
        });

        teardown();
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
        graphPage.getStats().should('have.text', 'Found 50 on 50');

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

    it('should copy filters to browse-result drawer', () => {
        menu.openChartDrawer();
        menu.goToChart('Bar Chart');

        graphPage.searchFor('Biodiversity');
        graphPage.getStats().should('have.text', 'Found 5 on 50');
        graphPage.setFacet('Publication Year', '2011');
        graphPage.getStats().should('have.text', 'Found 0 on 50');

        menu.openSearchDrawer();
        searchDrawer.getFacet('Publication Year').click();
        searchDrawer
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('not.checked');
        searchDrawer.searchInput().should('have.value', '');

        menu.closeSearchDrawer();
        graphPage.browseResults();

        browseResultDrawer.getFacet('Publication Year').click();
        browseResultDrawer.searchInput().should('have.value', 'Biodiversity');
        browseResultDrawer
            .getFacetItem('Publication Year', '2011')
            .find('input[type=checkbox]')
            .should('be.checked');

        menu.closeBrowseResultDrawer();
        graphPage.setFacetExclude('Publication Year');
        graphPage.browseResults();
        browseResultDrawer.getFacet('Publication Year (14)').click();
        browseResultDrawer.searchInput().should('have.value', 'Biodiversity');
        browseResultDrawer
            .getFacetExcludeItem('Publication Year')
            .find('input[type=checkbox]')
            .should('be.checked');
    });

    it('should support export as csv', () => {
        menu.openChartDrawer();
        menu.goToChart('Bar Chart');

        cy.wait(1000);
        cy.get('.vega-embed.has-actions details summary').click();
        cy.get('.vega-export-csv').should('be.visible');
        cy.get('.vega-export-csv').click();

        const downloadsFolder = Cypress.config('downloadsFolder');
        cy.readFile(
            path.join(downloadsFolder, `export_${getExportDateFormat()}.csv`),
        ).should('exist');
    });
});
