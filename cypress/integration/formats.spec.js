import { teardown, logoutAndLoginAs } from '../support/authentication';
import * as homePage from '../support/homePage';
import * as datasetImportPage from '../support/datasetImportPage';
import * as graphPage from '../support/graphPage';

describe('Transformers & Formats', () => {
    beforeEach(teardown);

    describe('LIST format', () => {
        it('should display a composed field with a LIST format', () => {
            homePage.goToAdminDashboard();

            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.setUriColumnValue();
            datasetImportPage.addColumn('Column 1', {
                composedOf: ['Column 1', 'Column 2'],
                display: {
                    format: 'list',
                },
            });
            datasetImportPage.publish();

            datasetImportPage.goToPublishedResources();
            homePage.goToGraphPage();

            cy.contains('Row 1').should('be.visible');
            cy.contains('Row 2').should('be.visible');
        });
    });

    describe('Broken Formats & Wrong Values', () => {
        beforeEach(() => {
            homePage.goToAdminDashboard();

            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/broken-formats.json');
            datasetImportPage.publish();

            cy.visit('http://localhost:3000/graph');

            cy.contains('Row 1').should('be.visible');
            cy.contains('Row 2').should('be.visible');

            graphPage.createResource({
                'Column 1': 'New Resource',
            });
        });

        describe('As Admin', () => {
            it('should display an error message describing the issue', () => {
                cy.get('.detail')
                    .find('.property')
                    .should('have.length', 2);

                cy.get('.detail')
                    .find('.invalid-format')
                    .should('have.length', 1);
            });
        });

        describe('As User', () => {
            it('should not display broken fields or error messages', () => {
                logoutAndLoginAs('user');
                homePage.goToGraphPage();

                graphPage.goToResourceFromRowContaining(
                    cy.contains('New Resource'),
                );

                cy.get('.detail')
                    .find('.property')
                    .should('have.length', 1);

                cy.get('.detail')
                    .find('.invalid-format')
                    .should('have.length', 0);
            });
        });
    });
});
