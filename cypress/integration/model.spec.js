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
        datasetImportPage.goToModel();
    });

    describe('should display characteristic fields', () => {
        it('should display list of characteristics and allow to reorder them', () => {
            cy.visit('/');
            cy.get('.property:nth-child(1)').contains('Title');
            cy.get('.property:nth-child(2)').contains('Description');
            cy.visit('/admin#/ontology');
            cy.get('.ontology-table-dataset h4').contains('Dataset');
            cy
                .get('.ontology-table-dataset table tbody tr')
                .should('have.length', 2);
            cy
                .get('.ontology-table-dataset table tbody tr:nth-child(1)')
                .contains('Title');
            cy
                .get('.ontology-table-dataset table tbody tr:nth-child(2)')
                .contains('Description');

            cy
                .get(
                    '.ontology-table-dataset table tbody tr:nth-child(1) .drag-handle',
                )
                .trigger('mousedown');
            cy
                .get('.ontology-table-dataset table tbody tr:nth-child(2)')
                .trigger('mousemove')
                .trigger('mouseup');

            cy
                .get('.ontology-table-dataset table tbody tr')
                .should('have.length', 2);
            cy
                .get('.ontology-table-dataset table tbody tr:nth-child(1)')
                .contains('Description');
            cy
                .get('.ontology-table-dataset table tbody tr:nth-child(2)')
                .contains('Title');

            cy.visit('/');
            cy.get('.property:nth-child(1)').contains('Description');
            cy.get('.property:nth-child(2)').contains('Title');
        });

        it('should display list of resource field and allow to reorder them', () => {
            cy.visit('/graph');
            graphPage.checkColumnHeaders(['#', 'Column 1', 'Column 2']);

            cy.visit('/admin#/ontology');

            cy.get('.ontology-table-dataset h4').contains('Dataset');
            modelPage.changeFilter('List of fields dedicated to each resource');
            cy.get('.ontology-table-dataset').should('not.exist');
            cy.get('.ontology-table-document h4').contains('Document');
            cy
                .get('.ontology-table-document table tbody tr')
                .should('have.length', 3);

            cy
                .get('.ontology-table-document table tbody tr:nth-child(1)')
                .contains('uri');
            cy
                .get('.ontology-table-document table tbody tr:nth-child(2)')
                .contains('Column 1');
            cy
                .get('.ontology-table-document table tbody tr:nth-child(3)')
                .contains('Column 2');

            cy
                .get(
                    '.ontology-table-document table tbody tr:nth-child(2) .drag-handle',
                )
                .trigger('mousedown');
            cy
                .get('.ontology-table-document table tbody tr:nth-child(3)')
                .trigger('mousemove')
                .trigger('mouseup');

            cy
                .get('.ontology-table-document table tbody tr')
                .should('have.length', 3);

            cy
                .get('.ontology-table-document table tbody tr:nth-child(1)')
                .contains('uri');
            cy
                .get('.ontology-table-document table tbody tr:nth-child(2)')
                .contains('Column 2');
            cy
                .get('.ontology-table-document table tbody tr:nth-child(3)')
                .contains('Column 1');

            cy.visit('/graph');
            graphPage.checkColumnHeaders(['#', 'Column 2', 'Column 1']);
        });
    });
});
