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
        // Intercept the enrichment list load and run all endpoints
        cy.intercept('GET', '/api/enrichment*').as('loadEnrichments');
        cy.intercept('POST', '/api/enrichment/runall').as('runAll');

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
        // Wait for the enrichments to load
        cy.wait('@loadEnrichments', { timeout: 15000 });
        cy.findAllByText('Not started', { timeout: 20000 }).should(
            'have.length',
            3,
        );
        
        cy.contains('Run All').click();

        // Wait for the dialog and confirm
        cy.findByRole('dialog', { timeout: 15000 }).should('be.visible').within(() => {
            cy.contains(
                'Are you sure you want to run all enrichments? This will also run enrichments that have completed successfully.',
            );
            cy.contains('Run All').click();
        });

        // Wait for the run all API call to complete
        cy.wait('@runAll', { timeout: 15000 });
        
        // Give Redux time to update the store
        cy.waitForNetworkIdle(2000);

        // Now check the statuses have changed
        cy.findAllByText('Not started', { timeout: 20000 }).should(
            'have.length',
            0,
        );
        cy.findAllByText('Running', { timeout: 20000 }).should('have.length.gte', 1);
        cy.findAllByText('Pending', { timeout: 20000 }).should('have.length.gte', 1);

        adminMenu.clearWorkers();
        cy.waitForNetworkIdle(500);
        cy.contains('All jobs have been cleared', { timeout: 10000 }).should('exist');
        cy.findAllByText('Canceled', { timeout: 20000 }).should('have.length.gte', 1);
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
            url: 'http://workers:31976/precomputed/statistics',
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
