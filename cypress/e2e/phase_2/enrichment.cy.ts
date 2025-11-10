import * as adminMenu from '../../support/adminMenu';
import * as adminNavigation from '../../support/adminNavigation';
import { teardown } from '../../support/authentication';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as enrichmentFormPage from '../../support/enrichmentFormPage';
import * as menu from '../../support/menu';

describe('Enrichment', () => {
    beforeEach(() => teardown());

    describe('Advanced enrichment', () => {
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
        cy.findAllByText('Canceled').should('have.length', 3);
    });
});
