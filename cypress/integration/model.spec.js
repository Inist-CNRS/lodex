import { teardown } from '../support/authentication';
import * as datasetImportPage from '../support/datasetImportPage';
import * as menu from '../support/menu';
import * as homePage from '../support/homePage';
import * as modelPage from '../support/modelPage';
import * as resourcePage from '../support/resourcePage';
import * as searchDrawer from '../support/searchDrawer';

describe('Model Page', () => {
    describe('handling fields and characteristics', () => {
        beforeEach(() => {
            teardown();
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/concat.json');
            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
        });

        it('should display list of characteristics and allow to reorder them', () => {
            homePage.checkCharacteristicsOrder(['Title', 'Description']);
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.goToModel();
            cy.contains('h4', 'Dataset').should('be.visible');
            modelPage.checkDatasetFieldOrder(['Title', 'Description']);

            modelPage.dragDatasetField(1, 2);

            modelPage.checkDatasetFieldOrder(['Description', 'Title']);

            modelPage.goToDatasetImportPage();
            datasetImportPage.goToPublishedResources();
            homePage.checkCharacteristicsOrder(['Description', 'Title']);
        });

        it('should display list of resource field and allow to reorder them', () => {
            menu.openSearchDrawer();
            searchDrawer.getFacetsOrder(['Column 1', 'Column 2']);

            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.goToModel();

            cy.contains('h4', 'Dataset').should('be.visible');
            cy.get('.sidebar')
                .contains('a', 'Resource pages')
                .click();
            cy.get('.ontology-table-dataset').should('not.exist');
            cy.contains('h4', 'Document').should('be.visible');

            modelPage.checkDocumentFieldOrder(['uri', 'Column 1', 'Column 2']);

            modelPage.dragDocumentField(2, 3);

            modelPage.checkDocumentFieldOrder(['uri', 'Column 2', 'Column 1']);

            modelPage.goToDatasetImportPage();
            datasetImportPage.goToPublishedResources();

            menu.openSearchDrawer();
            searchDrawer.getFacetsOrder(['Column 2', 'Column 1']);
        });
    });

    describe('handling old models', () => {
        beforeEach(() => {
            teardown();
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/film.csv');
            datasetImportPage.importModel('model/film-obsolete.json');
            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
        });

        it('should display list of fields in home', () => {
            homePage.checkCharacteristicsOrder([
                'Dataset Name',
                'Dataset Description',
                'Nombre de films',
                'Liste des films',
                'Répartition par créateurs',
            ]);

            cy.get('.property_label')
                .contains('rating')
                .should('not.be.visible');
        });

        it('should display list of fields in resources', () => {
            menu.openSearchDrawer();
            searchDrawer.search('Star Wars Episode IV: A New Hope');
            searchDrawer
                .findSearchResultByTitle('Star Wars Episode IV: A New Hope')
                .click();

            cy.get('.property_label')
                .contains('actors')
                .should('be.visible');

            cy.get('.property_value')
                .contains('Mark Hamill')
                .should('be.visible');

            cy.get('.property_label')
                .contains('rating')
                .should('be.visible');

            cy.get('.property_value')
                .contains('8,7')
                .should('be.visible');

            cy.get('.property_label')
                .contains('Répartition par créateurs')
                .should('not.be.visible');

            cy.get('.property_label')
                .contains('Répartition par réalisateurs uniques')
                .should('not.be.visible');
        });

        it('should display list of fields in graphics', () => {
            menu.openChartDrawer();

            cy.get('.graph-summary-label')
                .contains('Répartition par créateurs')
                .should('be.visible');

            cy.get('.graph-summary-label')
                .contains('Répartition par réalisateurs uniques')
                .should('be.visible');

            menu.goToChart('Répartition par créateurs');
        });
    });
});
