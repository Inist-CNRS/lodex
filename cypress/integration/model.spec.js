import { logoutAndLogin } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as homePage from '../support/homePage';
import * as modelPage from '../support/modelPage';
import * as graphPage from '../support/graphPage';

describe('Model Page', () => {
    beforeEach(() => {
        logoutAndLogin();
        homePage.goToAdminDashboard();
        datasetImportPage.importDataset('dataset/simple.csv');
        datasetImportPage.importModel('model/concat.json');
        datasetImportPage.publish();
        datasetImportPage.goToPublishedResources();
    });

    it('should display list of characteristics and allow to reorder them', () => {
        homePage.checkCharacteristicsOrder(['Title', 'Description']);
        homePage.goToAdminDashboard();
        datasetImportPage.goToModel();
        cy.get('.ontology-table-dataset h4').contains('Dataset');
        modelPage.checkDatasetFieldOrder(['Title', 'Description']);

        modelPage.dragDatasetField(1, 2);

        modelPage.checkDatasetFieldOrder(['Description', 'Title']);

        modelPage.goToDatasetImportPage();
        datasetImportPage.goToPublishedResources();
        homePage.checkCharacteristicsOrder(['Description', 'Title']);
    });

    it('should display list of resource field and allow to reorder them', () => {
        homePage.goToGraphPage();
        graphPage.checkColumnHeaders(['#', 'Column 1', 'Column 2']);

        homePage.goToAdminDashboard();
        datasetImportPage.goToModel();

        cy.get('.ontology-table-dataset h4').contains('Dataset');
        modelPage.changeFilter('List of fields dedicated to each resource');
        cy.get('.ontology-table-dataset').should('not.exist');
        cy.get('.ontology-table-document h4').contains('Document');

        modelPage.checkDocumentFieldOrder(['uri', 'Column 1', 'Column 2']);

        modelPage.dragDocumentField(2, 3);

        modelPage.checkDocumentFieldOrder(['uri', 'Column 2', 'Column 1']);

        modelPage.goToDatasetImportPage();
        datasetImportPage.goToPublishedResources();
        homePage.goToGraphPage();
        graphPage.checkColumnHeaders(['#', 'Column 2', 'Column 1']);
    });
});
