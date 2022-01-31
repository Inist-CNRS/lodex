import { teardown } from '../support/authentication';
import * as menu from '../support/menu';
import * as datasetImportPage from '../support/datasetImportPage';
import * as searchDrawer from '../support/searchDrawer';
import * as adminNavigation from '../support/adminNavigation';

describe('Dataset Publication', () => {
    beforeEach(teardown);

    describe('Dataset Import', () => {
        it('should get the list of possible loaders', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);
            datasetImportPage.addFile('dataset/simple.csv');

            datasetImportPage.checkListOfSupportedFileFormats();
            datasetImportPage.checkListOfFiltererFileFormats();
        });

        it('should receive a csv file and preview its data in a table', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);
            datasetImportPage.importDataset('dataset/simple.csv');
            cy.get('[data-rowindex=0]', { timeout: 500 }).should(
                'contains.text',
                ['"1"', '"Row 1"', '"Test 1"'].join(''),
            );

            cy.get('[data-rowindex=1]').should(
                'contains.text',
                ['"2"', '"Row 2"', '"Test 2"'].join(''),
            );
        });

        it('should display a information popup when adding a second dataset', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);
            datasetImportPage.importDataset('dataset/simple.csv');

            cy.get('.sidebar', { timeout: 500 })
                .contains('a', 'Add')
                .click();

            cy.wait(300);
            datasetImportPage.importOtherDataset('dataset/simple.csv');
            cy.wait(500);

            cy.get('[data-rowindex=1]').should(
                'contains.text',
                ['"2"', '"Row 2"', '"Test 2"'].join(''),
            );
        });
    });
    describe('Dataset Sorting', () => {
        it('should by default sort by uri asc', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);
            datasetImportPage.importDataset('dataset/simpleForOrderTests.csv');

            cy.get('[data-rowindex=0]', { timeout: 3000 }).should(
                'contains.text',
                ['"1"', '"Bobby"', '"Womack"'].join(''),
            );
        });

        it('should sort by firstName asc when clicking one time on it', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);
            datasetImportPage.importDataset('dataset/simpleForOrderTests.csv');

            cy.get(
                '[role=columnheader][data-field=firstName] [aria-label=Sort]',
                {
                    timeout: 500,
                },
            ).click({ force: true });

            cy.get('[data-rowindex=0]', { timeout: 3000 }).should(
                'contains.text',
                ['"2"', '"Alain"', '"Chabat"'].join(''),
            );
        });

        it('should sort by firstName desc when clicking two times on it', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);
            datasetImportPage.importDataset('dataset/simpleForOrderTests.csv');

            cy.get(
                '[role=columnheader][data-field=firstName] [aria-label=Sort]',
                {
                    timeout: 500,
                },
            ).click({ force: true });
            cy.get(
                '[role=columnheader][data-field=firstName] [aria-label=Sort]',
                {
                    timeout: 500,
                },
            ).click({ force: true });

            cy.get('[data-rowindex=0]', { timeout: 3000 }).should(
                'contains.text',
                ['"4"', '"Rob"', '"Zombie"'].join(''),
            );
        });
    });
    describe('Publication', () => {
        it('should display a disabled publish button if no model', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            adminNavigation.goToDisplay();
            cy.get('.btn-publish button', { timeout: 300 }).should(
                'be.disabled',
            );
        });

        it('should enable publish button if model', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            adminNavigation.goToDisplay();
            cy.get('.sidebar')
                .contains('a', 'Resource pages')
                .click();

            datasetImportPage.addColumn('Column 1');
            cy.get('.btn-publish button', { timeout: 300 }).should(
                'not.be.disabled',
            );
        });

        it('should publish dataset by manually adding columns', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            adminNavigation.goToDisplay();

            cy.get('.sidebar')
                .contains('a', 'Resource pages')
                .click();

            datasetImportPage.addColumn('Column 1');

            cy.contains('button', 'Données publiées').click();

            cy.get('.publication-excerpt')
                .contains('Row 1')
                .should('be.visible');
            cy.get('.publication-excerpt')
                .contains('Row 2')
                .should('be.visible');

            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
        });

        it('should publish dataset by importing an existing model', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/concat.json');

            cy.get('.sidebar')
                .contains('a', 'Resource pages')
                .click();

            cy.contains('button', 'Données publiées').click();

            cy.contains('["Row 1","Test 1"]').should('be.visible');
            cy.contains('["Row 2","Test 2"]').should('be.visible');

            datasetImportPage.publish();
            datasetImportPage.goToPublishedResources();
            menu.openSearchDrawer();

            cy.get('.search-result-title')
                .contains('Row 1')
                .should('be.visible');
            cy.get('.search-result-title')
                .contains('Row 2')
                .should('be.visible');
        });

        it('should allow to fix obsolete imported model before publish dataset', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/concat-obsolete.json');

            cy.contains('Errors').click();
            cy.contains('Operation UNKNOWN-OPERATION does not exist').click();

            datasetImportPage.setOperationTypeInWizard('BOOLEAN');
            datasetImportPage.publish();
        });

        it('should allow to load a file multiple times', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/concat.json');
            datasetImportPage.publish();
            cy.wait(300);
            cy.log('import 1');
            datasetImportPage.importMoreDataset('dataset/simplewithouturi.csv');
            cy.log('import 2');
            datasetImportPage.importMoreDataset('dataset/simplewithouturi.csv');
            cy.log('import 3');
            datasetImportPage.importMoreDataset('dataset/simplewithouturi.csv');
            cy.log('import 4');
            datasetImportPage.importMoreDataset('dataset/simplewithouturi.csv');
            cy.log('import 5');
            datasetImportPage.importMoreDataset('dataset/simplewithouturi.csv');
            cy.log('import 6');
            datasetImportPage.importMoreDataset('dataset/simplewithouturi.csv');

            cy.log('go to published resource');
            datasetImportPage.goToPublishedResources();

            cy.log('Open searchDrawer');
            menu.openSearchDrawer();
            searchDrawer.checkMoreResultsCount(10, 14);
        });
    });

    describe('Facets', () => {
        it('should allow to have a facet with a single value', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/single-facet.csv');
            datasetImportPage.importModel('model/facet.json');
            datasetImportPage.publish();

            datasetImportPage.goToPublishedResources();
            menu.openSearchDrawer();

            cy.contains('Affiliation(s)').click();
            cy.get('.search-facets')
                .find('.facet-item')
                .should('have.length', 1);

            cy.get('.search-facets')
                .find('.facet-value-item')
                .should('have.length', 1);
        });

        it('should allow to have facets with multiples values in them', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/multiple-facet.csv');
            datasetImportPage.importModel('model/facet.json');
            datasetImportPage.publish();

            datasetImportPage.goToPublishedResources();
            menu.openSearchDrawer();

            cy.contains('Affiliation(s)').click();
            cy.get('.search-facets')
                .find('.facet-item')
                .should('have.length', 1);

            cy.get('.search-facets')
                .find('.facet-value-item')
                .should('have.length', 3);
        });
    });
});
