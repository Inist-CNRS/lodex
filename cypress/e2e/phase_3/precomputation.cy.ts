import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as adminNavigation from '../../support/adminNavigation';
import * as menu from '../../support/menu';
import * as precomputation from '../../support/precomputation';

function loadPrecomputedDataset() {
    // ResizeObserver doesn't like when the app has to many renders / re-renders
    // and throws an exception to say, "I wait for the next paint"
    // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors
    cy.on('uncaught:exception', (error) => {
        return !error.message.includes('ResizeObserver');
    });

    teardown();
    menu.openAdvancedDrawer();
    menu.goToAdminDashboard();
    datasetImportPage.importDataset('dataset/film.csv');
    datasetImportPage.importModel('model/film.json');
    adminNavigation.goToData();
    adminNavigation.goToPreComputation();
}

describe('Precomputation', () => {
    beforeEach(loadPrecomputedDataset);

    it('should allow to create a new preComputation, launch it and see its results', () => {
        cy.contains('No rows').should('be.visible');
        precomputation.createPrecomputation({
            name: 'Statistics',
            url: 'http://data-computer:31976/v1/statistics',
            sourceColumns: ['actors'],
        });
        adminNavigation.goToData();
        cy.waitForNetworkIdle(500);
        cy.contains('Precomputed data').click();
        cy.waitForNetworkIdle(500);
        cy.contains('No rows').should('be.visible');
        cy.findByLabelText('Select precomputed data').should(
            'contain',
            'Statistics (Not started)',
        );
        adminNavigation.goToPreComputation();
        cy.waitForNetworkIdle(500);
        cy.contains('1–1 of 1').should('be.visible');
        cy.contains('Statistics').click();
        precomputation.checkPrecomputationFormValues({
            name: 'Statistics',
            url: 'http://data-computer:31976/v1/statistics',
            sourceColumns: ['actors'],
            status: 'Not started',
        });
        cy.findByRole('button', { name: 'Run' }).click();
        precomputation.checkPrecomputationFormValues({
            name: 'Statistics',
            url: 'http://data-computer:31976/v1/statistics',
            sourceColumns: ['actors'],
            status: 'Done',
        });
        adminNavigation.goToData();
        cy.waitForNetworkIdle(500);
        cy.contains('Precomputed data').click();
        cy.waitForNetworkIdle(500);
        cy.findByLabelText('Select precomputed data').should(
            'contain',
            'Statistics (Done)',
        );

        cy.contains('1–25 of 30').should('be.visible');
        cy.findAllByRole('columnheader').should('have.length', 3);
        cy.findByRole('columnheader', { name: 'id' }).should('be.visible');
        cy.findByRole('columnheader', { name: 'value' }).should('be.visible');
    });
});
