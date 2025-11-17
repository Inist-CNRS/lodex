import * as adminMenu from '../../support/adminMenu';
import * as adminNavigation from '../../support/adminNavigation';
import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as enrichmentFormPage from '../../support/enrichmentFormPage';
import * as menu from '../../support/menu';
import * as precomputation from '../../support/precomputation';

describe('Enrichment', () => {
    beforeEach(() => teardown());
    it('should add an advanced enrichment', () => {
        cy.intercept('POST', '/api/enrichment/preview').as('preview');

        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();
        cy.waitForNetworkIdle(500);

        datasetImportPage.addFile('dataset/simple.csv');
        enrichmentFormPage.openEnrichment();
        cy.waitForNetworkIdle(500);

        enrichmentFormPage.fillAdvancedEnrichment();
        // We test here that we do not spam preview when filling the advanced rule input
        cy.get('@preview.all').then((interceptions) => {
            expect(interceptions).to.have.length.below(4);
        });
        enrichmentFormPage.updateNameEnrichment();
        enrichmentFormPage.runEnrichment();
        adminNavigation.goToData();
        cy.waitForNetworkIdle(500);
        enrichmentFormPage.checkIfEnrichmentExistInDataset();
    });

    it('should run all enrichments from dataset page', () => {
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();
        cy.waitForNetworkIdle(500);

        datasetImportPage.addFile('dataset/simple.csv');
        enrichmentFormPage.openEnrichment();

        enrichmentFormPage.fillAdvancedEnrichment('Enrichment 1');
        enrichmentFormPage.openEnrichment();
        enrichmentFormPage.fillAdvancedEnrichment('Enrichment 2');
        enrichmentFormPage.openEnrichment();
        enrichmentFormPage.fillAdvancedEnrichment('Enrichment 3');

        enrichmentFormPage.openEnrichment();
        cy.findAllByText('Not started').should('have.length', 3);
        cy.contains('Run All').click();

        cy.findByRole('dialog').within(() => {
            cy.contains(
                'Are you sure you want to run all enrichments? This will also run enrichments that have completed successfully.',
            );
            cy.contains('Run All').click();
        });

        cy.findAllByText('Not started').should('have.length', 0);
        cy.findAllByText('Running').should('have.length', 1);
        cy.findAllByText('Pending').should('have.length', 2);

        adminMenu.clearWorkers();
        cy.waitForNetworkIdle(500);
        cy.contains('All jobs have been cleared').should('exist');
        cy.findAllByText('Canceled').should('have.length.gte', 2);
    });

    it('should support enriching dataset', () => {
        cy.intercept('POST', '/api/enrichment/preview').as('preview');

        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();
        cy.waitForNetworkIdle(2500);

        datasetImportPage.importDataset('dataset/film.csv');
        datasetImportPage.importModel('model/film.json');
        adminNavigation.goToData();

        enrichmentFormPage.openEnrichment();

        cy.contains('Add more').click();
        cy.waitForNetworkIdle(2500);
        cy.findByLabelText('Name *').type('enrichment');

        cy.findByLabelText('Web service URL *').type(
            'http://localhost:3000/tests/enrichment/idempotent',
        );

        cy.findByLabelText('Data source *').click();

        cy.findByLabelText('Source column *').click();
        cy.findByRole('option', {
            name: 'title',
        }).click();

        cy.findByRole('button', { name: 'Save' }).click();
        cy.waitForNetworkIdle(2500);

        cy.findByRole('button', { name: 'Run' }).click();
        cy.findByText('Done', {
            timeout: 15000,
        }).should('exist');

        cy.findByRole('link', { name: 'Data' }).click();
        cy.waitForNetworkIdle(2500);

        cy.findByText('enrichment').should('be.visible');
    });

    it('should support enriching precompute', () => {
        cy.intercept('POST', '/api/enrichment/preview').as('preview');

        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();
        cy.waitForNetworkIdle(2500);

        datasetImportPage.importDataset('dataset/film.csv');
        datasetImportPage.importModel('model/film.json');
        adminNavigation.goToData();
        adminNavigation.goToPreComputation();

        cy.waitForNetworkIdle(2500);

        precomputation.createPrecomputation({
            name: 'Statistics',
            url: 'http://data-computer:31976/v1/statistics',
            sourceColumns: ['actors'],
        });

        cy.findByRole('button', { name: 'Run' }).click();
        cy.findByText('Done', {
            timeout: 15000,
        }).should('exist');

        enrichmentFormPage.openEnrichment();

        cy.contains('Add more').click();
        cy.waitForNetworkIdle(2500);
        cy.findByLabelText('Name *').type('enrichment');

        cy.findByLabelText('Web service URL *').type(
            'http://localhost:3000/tests/enrichment/idempotent',
        );

        cy.findByLabelText('Data source *').click();
        cy.findByRole('option', {
            name: 'Statistics',
        }).click();

        cy.findByLabelText('Source column *').click();
        cy.findByRole('option', {
            name: 'value',
        }).click();

        cy.findByLabelText('Sub-path').click();
        cy.findByRole('option', {
            name: 'input',
        }).click();

        cy.findByRole('button', { name: 'Save' }).click();
        cy.waitForNetworkIdle(2500);

        cy.findByRole('button', { name: 'Run' }).click();
        cy.findByText('Done', {
            timeout: 45000,
        }).should('exist');

        cy.findByRole('link', { name: 'Data' }).click();
        cy.waitForNetworkIdle(2500);

        cy.findByText('Precomputed data').click();
        cy.waitForNetworkIdle(2500);

        cy.findByText('enrichment').should('be.visible');
    });
});
