import { logoutAndLogin } from '../support/authentication';
import * as homePage from '../support/homePage';
import * as datasetImportPage from '../support/datasetImportPage';
import { fillInputWithFixture } from '../support/forms';

describe('Dataset Import Page', () => {
    beforeEach(logoutAndLogin);

    describe('Dataset Import', () => {
        it('should receive a csv file and preview its data in a table', () => {
            homePage.goToAdminDashboard();
            datasetImportPage.openImportModal();

            fillInputWithFixture(
                '.btn-upload-dataset input[type=file]',
                'dataset/simple.csv',
                'text/csv',
            );

            cy
                .get('tbody')
                .should(
                    'have.text',
                    ['Row 1', 'Test 1', 'Row 2', 'Test 2'].join(''),
                );
        });
    });

    describe('Publication', () => {
        it('should publish dataset by manually adding columns', () => {
            homePage.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.addColumn('Column 1');

            cy
                .get('.publication-excerpt')
                .contains('Row 1')
                .should('be.visible');
            cy
                .get('.publication-excerpt')
                .contains('Row 2')
                .should('be.visible');

            datasetImportPage.setUriColumnValue();
            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
            homePage.goToGraphPage();

            cy.contains('Row 1').should('be.visible');
            cy.contains('Row 2').should('be.visible');
        });

        it('should publish dataset by importing an existing model', () => {
            homePage.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/concat.json');

            cy.contains('["Row 1","Test 1"]').should('be.visible');
            cy.contains('["Row 2","Test 2"]').should('be.visible');

            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
            homePage.goToGraphPage();

            cy.contains('Row 1').should('be.visible');
            cy.contains('Row 2').should('be.visible');
        });
    });
});
