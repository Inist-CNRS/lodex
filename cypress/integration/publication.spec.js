import { teardown } from '../support/authentication';
import * as menu from '../support/menu';
import * as datasetImportPage from '../support/datasetImportPage';
import * as adminNavigation from '../support/adminNavigation';

describe('Dataset Publication', () => {
    beforeEach(teardown);

    describe('Dataset Import', () => {
        it('should get the list of possible loaders', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);
            datasetImportPage.addFileWithoutClick('dataset/simple.csv');

            datasetImportPage.checkListOfSupportedFileFormats();
            datasetImportPage.checkListOfFiltererFileFormats();
        });

        it('should receive a csv file and preview its data in a table', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);
            datasetImportPage.importDataset('dataset/simple.csv');
            cy.wait(300);
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
            cy.wait(1000);
            cy.contains('Add more', { timeout: 1500 }).click();

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
    describe('Dataset Filtering', () => {
        it('should filter by uri', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);
            datasetImportPage.importDataset(
                'dataset/simpleForFilterTests.json',
            );
            cy.get('[role=columnheader][data-field=uri] [aria-label=Menu]', {
                timeout: 500,
            }).click({ force: true });
            cy.get('[role=menu] :nth-child(4)').click();
            cy.focused().type('2');

            cy.get('[data-rowindex=0]', { timeout: 3000 }).should(
                'contains.text',
                ['2', '"Alain"', '"Chabat"', 'true'].join(''),
            );
        });
        it('should filter by firstName', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);
            datasetImportPage.importDataset(
                'dataset/simpleForFilterTests.json',
            );
            cy.get(
                '[role=columnheader][data-field=firstName] [aria-label=Menu]',
                {
                    timeout: 500,
                },
            ).click({ force: true });
            cy.wait(100);
            cy.get('[role=menu] :nth-child(4)').click({ force: true });
            cy.focused().type('b');

            cy.get('[data-rowindex=0]', { timeout: 3000 }).should(
                'contains.text',
                ['1', '"Bobby"', '"Womack"', 'true'].join(''),
            );

            cy.get('[data-rowindex=1]', { timeout: 3000 }).should(
                'contains.text',
                ['4', '"Rob"', '"Zombie"', 'false'].join(''),
            );
        });
        it('should filter by boolean', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            cy.wait(300);
            datasetImportPage.importDataset(
                'dataset/simpleForFilterTests.json',
            );
            cy.get(
                '[role=columnheader][data-field=boolean] [aria-label=Menu]',
                {
                    timeout: 500,
                },
            ).click({ force: true });
            cy.get('[role=menu] :nth-child(4)').click();
            cy.focused().select('true');

            cy.get('[data-rowindex=0]', { timeout: 3000 }).should(
                'contains.text',
                ['1', '"Bobby"', '"Womack"', 'true'].join(''),
            );

            cy.get('[data-rowindex=1]', { timeout: 3000 }).should(
                'contains.text',
                ['2', '"Alain"', '"Chabat"', 'true'].join(''),
            );
        });
    });

    describe('Transformers upsert', () => {
        it('should allow to add and update transformers', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/simple.json');

            adminNavigation.goToDisplay();
            cy.get('.sidebar')
                .contains('Main resource')
                .click();

            cy.contains('New field').click();
            cy.get('.wizard', { timeout: 10000 }).should('be.visible');
            cy.wait(1000);

            cy.contains('Arbitrary value').click();
            cy.contains('Add an operation').click();

            cy.get('[aria-label="Select an operation"]').click();
            cy.contains('BOOLEAN').click();
            cy.contains('confirm').click();

            cy.get('[aria-label="transformer-edit-transformers[1]').click();
            cy.get('[aria-label="Select an operation"]').click();
            cy.contains('GET').click();
            cy.get('input[placeholder="path"]').type('example');
            cy.contains('confirm').click();
            cy.contains('GET');
            cy.contains('example');
            cy.get('.btn-save').click();
            cy.get('.wizard').should('not.exist');
        });

        it('should keep transformers when changing source value', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/simple.json');

            adminNavigation.goToDisplay();
            cy.get('.sidebar')
                .contains('Main resource')
                .click();

            cy.contains('New field').click();
            cy.get('.wizard', { timeout: 10000 }).should('be.visible');
            cy.wait(1000);

            cy.contains('Arbitrary value').click();
            cy.get('textarea[placeholder="Enter an arbitrary value"]').type(
                'test',
            );

            cy.contains('Add an operation').click();

            cy.get('[aria-label="Select an operation"]').click();
            cy.contains('UPPERCASE').click();
            cy.contains('confirm').click();

            cy.get('textarea[placeholder="Enter an arbitrary value"]').type(
                'updated',
            );
            cy.contains('UPPERCASE').should('be.visible');

            cy.contains('Existing Column(s)').click();
            cy.get('[data-testid="source-value-from-columns"]').click();
            cy.get('[role="listbox"]')
                .contains('Column 1')
                .click();
            cy.contains('UPPERCASE').should('be.visible');

            cy.get('[data-testid="source-value-from-columns"]').click();
            cy.get('[role="listbox"]')
                .contains('Column 2')
                .click();
            cy.contains('UPPERCASE').should('be.visible');

            cy.get('.btn-save').click();
            cy.get('.wizard').should('not.exist');
        });

        it('should remove transformers when clicking on delete all', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            datasetImportPage.importModel('model/simple.json');

            adminNavigation.goToDisplay();
            cy.get('.sidebar')
                .contains('Main resource')
                .click();

            cy.contains('New field').click();
            cy.get('.wizard', { timeout: 10000 }).should('be.visible');
            cy.wait(1000);

            cy.contains('Arbitrary value').click();
            cy.get('textarea[placeholder="Enter an arbitrary value"]').type(
                'test',
            );

            cy.contains('Add an operation').click();
            cy.get('[aria-label="Select an operation"]').click();
            cy.contains('UPPERCASE').click();
            cy.contains('confirm').click();

            cy.contains('Add an operation').click();
            cy.get('[aria-label="Select an operation"]').click();
            cy.contains('SUFFIX').click();
            cy.get('input[placeholder="with"]').type('suffix');
            cy.contains('confirm').click();

            cy.contains('UPPERCASE').should('be.visible');
            cy.contains('SUFFIX').should('be.visible');

            cy.contains('Delete all').click();
            cy.get('.confirm-delete-all').click();
            cy.contains('UPPERCASE').should('not.exist');
            cy.contains('SUFFIX').should('not.exist');

            cy.get('.btn-save').click();
            cy.get('.wizard').should('not.exist');
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
                .contains('Main resource')
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
                .contains('Main resource')
                .click();

            datasetImportPage.addColumn('Column 1');

            cy.contains('button', 'Published data').click();

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

            adminNavigation.goToDisplay();
            cy.get('.sidebar')
                .contains('Main resource')
                .click();

            cy.contains('button', 'Published data').click();

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

            cy.get('.validation-button').click();
            cy.contains('Operation UNKNOWN-OPERATION does not exist').click();

            datasetImportPage.setOperationTypeInWizard('BOOLEAN');
            datasetImportPage.publish();
        });

        it('should allow to load a file multiple times', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/simple.csv');
            cy.wait(500);
            datasetImportPage.importModel('model/concat.json');
            datasetImportPage.publish();
            cy.wait(3000);
            cy.log('import 1');
            datasetImportPage.importMoreDataset('dataset/simplewithouturi.csv');

            cy.log('go to published resource');
            datasetImportPage.goToPublishedResources();

            cy.log('Open searchDrawer');
            menu.openSearchDrawer();
            cy.get('.search-result-link').should('have.length', 4);
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
    describe('Automatic Publication', () => {
        it('should re-publish dataset when updating field', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/book_summary.csv');
            datasetImportPage.importModel('model/book_summary.json');
            datasetImportPage.publish();
            adminNavigation.goToResourcePage();
            cy.wait(2000);
            cy.get('[aria-label="Title"]', { timeout: 3000 })
                .eq(0)
                .click({
                    force: true,
                });
            cy.get('.btn-save').click();

            cy.get('[aria-label="job-progress"]', { timeout: 3000 }).should(
                'have.css',
                'opacity',
                '1',
            );
        });
        it('should re-publish dataset when deleting field', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();
            datasetImportPage.importDataset('dataset/book_summary.csv');
            datasetImportPage.importModel('model/book_summary.json');
            datasetImportPage.publish();
            adminNavigation.goToResourcePage();
            cy.wait(2000);
            cy.get('[aria-label="Title"]', { timeout: 3000 })
                .eq(0)
                .click({
                    force: true,
                });
            cy.contains('Remove').click({ force: true });
            cy.contains('Accept').click({ force: true });

            cy.get('[aria-label="job-progress"]', { timeout: 3000 }).should(
                'have.css',
                'opacity',
                '1',
            );
        });
    });
});
