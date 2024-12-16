import { teardown } from '../../support/authentication';
import * as menu from '../../support/menu';
import * as adminNavigation from '../../support/adminNavigation';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as enrichmentFormPage from '../../support/enrichmentFormPage';

describe('Enrichment', () => {
    beforeEach(teardown);

    describe('Advanced enrichment', () => {
        it('should add an advanced enrichment', () => {
            cy.intercept('POST', '/api/enrichment/preview').as('preview');

            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);

            datasetImportPage.addFile('dataset/simple.csv');
            enrichmentFormPage.openEnrichment();
            cy.wait(300);

            enrichmentFormPage.fillAdvancedEnrichment();
            // We test here that we do not spam preview when filling the advanced rule input
            cy.get('@preview.all').then((interceptions) => {
                expect(interceptions).to.have.length(2);
            });
            enrichmentFormPage.updateNameEnrichment();
            enrichmentFormPage.runEnrichment();
            adminNavigation.goToData();
            cy.wait(300);
            enrichmentFormPage.checkIfEnrichmentExistInDataset();
        });
    });
});
