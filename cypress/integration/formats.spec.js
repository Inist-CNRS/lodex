import { teardown, logoutAndLoginAs } from '../support/authentication';
import * as menu from '../support/menu';
import * as datasetImportPage from '../support/datasetImportPage';
import * as adminNavigation from '../support/adminNavigation';

describe('Transformers & Formats', () => {
    beforeEach(teardown);

    describe('LIST format', () => {
        it('should display a composed field with a LIST format', () => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();

            datasetImportPage.importDataset('dataset/simple.csv');

            adminNavigation.goToDisplay();
            cy.get('.sidebar')
                .contains('a', 'Resource pages')
                .click();

            datasetImportPage.addColumn('Column 1', {
                composedOf: ['Column 1', 'Column 2'],
                display: {
                    format: 'list',
                },
                searchable: true,
            });

            datasetImportPage.publish();

            datasetImportPage.goToPublishedResources();
            menu.openSearchDrawer();

            cy.contains('Row 1').should('be.visible');
            cy.contains('Row 2').should('be.visible');
        });
    });

    describe('Broken Formats & Wrong Values', () => {
        beforeEach(() => {
            menu.openAdvancedDrawer();
            menu.goToAdminDashboard();

            datasetImportPage.importDataset('dataset/broken-formats.csv');
            datasetImportPage.importModel('model/broken-formats.json');
            datasetImportPage.publish();

            cy.visit('http://localhost:3000/uid:/wrong');
        });

        describe('As Admin', () => {
            describe('when we have a single value but want a list', () => {
                it('should display an error message describing the issue and allow to fix the value for wrong list format', () => {
                    cy.get('.detail')
                        .find('.property')
                        .should('have.length', 2);

                    cy.get('.detail')
                        .find('.invalid-format')
                        .should('have.length', 2);

                    cy.get('.format_markdown .edit-field').click();
                    cy.get('#field_form p').contains(
                        'Cannot edit this value, format expected a single value but got a list',
                    );
                    cy.get('#field_form .convert-to-value').click();
                    cy.get('#field_form textarea').contains('item1;item2');
                    cy.get('.edit-field.save').click();
                    cy.get('.detail')
                        .find('.property')
                        .should('have.length', 2);

                    cy.get('.detail')
                        .find('.invalid-format')
                        .should('have.length', 1);

                    cy.get('.detail')
                        .find('.property.format_markdown')
                        .contains('item1;item2');
                });

                it('should display an error message describing the issue and changing the format should fix it', () => {
                    cy.get('.detail')
                        .find('.property')
                        .should('have.length', 2);

                    cy.get('.detail')
                        .find('.invalid-format')
                        .should('have.length', 2);
                });
            });

            describe('when we want a list but have a single value', () => {
                it('should display an error message describing the issue and allow to fix the value for wrong markdown format', () => {
                    cy.get('.detail')
                        .find('.property')
                        .should('have.length', 2);

                    cy.get('.detail')
                        .find('.invalid-format')
                        .should('have.length', 2);

                    cy.get('.format_list .edit-field').click();
                    cy.get('#field_form p').contains(
                        'Cannot edit this value, format expected an Array but got a single value',
                    );
                    cy.get('#field_form .convert-to-list').click();
                    cy.get('#field_form input').should('have.length', 1);
                    cy.get('#field_form input').should('have.value', 'value');
                    cy.get('.edit-field.save').click();
                    cy.get('.detail')
                        .find('.property')
                        .should('have.length', 2);

                    cy.get('.detail')
                        .find('.invalid-format')
                        .should('have.length', 1);

                    cy.get('.detail')
                        .find('.format_list li')
                        .should('have.length', 1);

                    cy.get('.detail')
                        .find('.format_list li')
                        .contains('value');
                });

                it('should display an error message describing the issue', () => {
                    cy.get('.detail')
                        .find('.property')
                        .should('have.length', 2);

                    cy.get('.detail')
                        .find('.invalid-format')
                        .should('have.length', 2);
                });
            });
        });

        describe('As User', () => {
            it('should not display broken fields or error messages', () => {
                logoutAndLoginAs('user');

                cy.visit('http://localhost:3000/uid:/wrong');

                cy.get('.detail')
                    .find('.property')
                    .should('have.length', 0);

                cy.get('.detail')
                    .find('.invalid-format')
                    .should('have.length', 0);
            });
        });
    });
});
