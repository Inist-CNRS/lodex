import { teardown } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as homePage from '../support/homePage';

describe('Chart Menu', () => {
    beforeEach(() => {
        teardown();
        homePage.goToAdminDashboard();
        datasetImportPage.importDataset('dataset/chart.csv');
        datasetImportPage.importModel('model/chart.json');
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    it('should display chart menu withlist of all chart', () => {
        homePage.openChartDrawer();
        const charts = [
            'Bar Chart',
            'Bubble Chart',
            'Pie Chart',
            'Radar Chart',
        ];
        const chartMenu = cy.get('.graph-summary');
        charts.forEach(chartName => {
            chartMenu
                .get(`.graph-link`)
                .contains(chartName)
                .should('be.visible');
        });

        homePage.goToChart('Pie Chart');
        homePage.openChartDrawer();

        cy.get(`.graph-link.active`)
            .contains('Pie Chart')
            .should('be.visible');
    });
});
