import { teardown } from '../support/authentication';
import * as homePage from '../support/homePage';
import * as datasetImportPage from '../support/datasetImportPage';
import { fillInputWithFixture } from '../support/forms';
import * as searchDrawer from '../support/searchDrawer';

describe('Dataset Publication', () => {
    beforeEach(teardown);

    describe('Dataset Import', () => {
        it('should receive a csv file and preview its data in a table', () => {
            homePage.openAdvancedDrawer();
            homePage.goToAdminDashboard();
            datasetImportPage.openImportDialog();

            fillInputWithFixture(
                '.btn-upload-dataset input[type=file]',
                'dataset/simple.csv',
                'text/csv',
            );

            cy.get('tbody').should(
                'have.text',
                ['1', 'Row 1', 'Test 1', '2', 'Row 2', 'Test 2'].join(''),
            );
        });
    });

    describe('Publication', () => {
        it('should publish dataset by manually adding columns', () => {
            homePage.openAdvancedDrawer();
            homePage.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.addColumn('Column 1');

            cy.get('.publication-excerpt')
                .contains('Row 1')
                .should('be.visible');
            cy.get('.publication-excerpt')
                .contains('Row 2')
                .should('be.visible');

            datasetImportPage.setUriColumnValue();
            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
            searchDrawer.openSearchDrawer();

            cy.contains('Row 1').should('be.visible');
            cy.contains('Row 2').should('be.visible');
        });

        it('should publish dataset by importing an existing model', () => {
            homePage.openAdvancedDrawer();
            homePage.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/concat.json');

            cy.contains('["Row 1","Test 1"]').should('be.visible');
            cy.contains('["Row 2","Test 2"]').should('be.visible');

            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
            searchDrawer.openSearchDrawer();

            cy.get('.search-result-title')
                .contains('Row 1')
                .should('be.visible');
            cy.get('.search-result-title')
                .contains('Row 2')
                .should('be.visible');
        });

        it('should allow to load a file multiple times', () => {
            homePage.openAdvancedDrawer();
            homePage.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/concat.json');
            datasetImportPage.publish();

            datasetImportPage.importMoreDataset('dataset/simple.csv');
            datasetImportPage.importMoreDataset('dataset/simple.csv');
            datasetImportPage.importMoreDataset('dataset/simple.csv');
            datasetImportPage.importMoreDataset('dataset/simple.csv');
            datasetImportPage.importMoreDataset('dataset/simple.csv');
            datasetImportPage.importMoreDataset('dataset/simple.csv');

            datasetImportPage.goToPublishedResources();

            searchDrawer.openSearchDrawer();
            searchDrawer.checkMoreCount(10, 14);
        });
    });

    describe('Facets', () => {
        it('should allow to have a facet with a single value', () => {
            homePage.openAdvancedDrawer();
            homePage.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/single-facet.csv');
            datasetImportPage.importModel('model/facet.json');
            datasetImportPage.publish();

            datasetImportPage.goToPublishedResources();
            searchDrawer.openSearchDrawer();

            cy.contains('Affiliation(s)').click();
            cy.get('.facet-list')
                .find('.facet-item')
                .should('have.length', 1);

            cy.get('.facet-list')
                .find('.facet-value-item')
                .should('have.length', 1);
        });

        it('should allow to have facets with multiples values in them', () => {
            homePage.openAdvancedDrawer();
            homePage.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/multiple-facet.csv');
            datasetImportPage.importModel('model/facet.json');
            datasetImportPage.publish();

            datasetImportPage.goToPublishedResources();
            searchDrawer.openSearchDrawer();

            cy.contains('Affiliation(s)').click();
            cy.get('.facet-list')
                .find('.facet-item')
                .should('have.length', 1);

            cy.get('.facet-list')
                .find('.facet-value-item')
                .should('have.length', 3);
        });
    });
});
