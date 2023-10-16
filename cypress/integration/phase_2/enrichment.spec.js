import { teardown } from '../../support/authentication';
import * as menu from '../../support/menu';
import * as adminNavigation from '../../support/adminNavigation';
import * as datasetImportPage from '../../support/datasetImportPage';
import * as enrichmentFormPage from '../../support/enrichmentFormPage';

describe('Enrichment', () => {
    beforeEach(teardown);

    describe('Advanced enrichment', () => {
        it('should add an advanced enrichment', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);

            datasetImportPage.addFile('dataset/simple.csv');
            enrichmentFormPage.openEnrichment();
            cy.wait(300);
            enrichmentFormPage.fillAdvancedEnrichment();
            enrichmentFormPage.runEnrichment();
            adminNavigation.goToData();
            cy.wait(300);
            enrichmentFormPage.checkIfEnrichmentExistInDataset();
        });
    });
});
