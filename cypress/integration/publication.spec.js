import { teardown } from '../support/authentication';
import * as homePage from '../support/homePage';
import * as datasetImportPage from '../support/datasetImportPage';
import * as graphPage from '../support/graphPage';
import { fillInputWithFixture } from '../support/forms';

describe('Dataset Publication', () => {
    beforeEach(teardown);

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

        it('should allow to load a file multiple times', () => {
            homePage.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/concat.json');
            datasetImportPage.publish();

            datasetImportPage.importMoreDataset('dataset/simple.csv');
            datasetImportPage.importMoreDataset('dataset/simple.csv');

            datasetImportPage.goToPublishedResources();
            homePage.goToGraphPage();

            graphPage.expectRowsCountToBe(6);
        });
    });

    describe('Facets', () => {
        it('should allow to have a facet with a single value', () => {
            homePage.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/single-facet.csv');
            datasetImportPage.importModel('model/facet.json');
            datasetImportPage.publish();

            datasetImportPage.goToPublishedResources();
            homePage.goToGraphPage();

            cy.contains('Affiliation(s)').click();
            cy
                .get('.facet-list')
                .find('.facet-item')
                .should('have.length', 1);

            cy
                .get('.facet-list')
                .find('.facet-value-item')
                .should('have.length', 1);
        });

        it('should allow to have facets with multiples values in them', () => {
            homePage.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/multiple-facet.csv');
            datasetImportPage.importModel('model/facet.json');
            datasetImportPage.publish();

            datasetImportPage.goToPublishedResources();
            homePage.goToGraphPage();

            cy.contains('Affiliation(s)').click();
            cy
                .get('.facet-list')
                .find('.facet-item')
                .should('have.length', 1);

            cy
                .get('.facet-list')
                .find('.facet-value-item')
                .should('have.length', 3);
        });
    });
});
