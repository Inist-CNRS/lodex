import { teardown } from '../support/authentication';
import * as menu from '../support/menu';
import * as navigationPage from '../support/adminNavigation';
import * as datasetImportPage from '../support/datasetImportPage';
import * as subresourcePage from '../support/subresource';
import * as searchDrawer from '../support/searchDrawer';

describe('Subresource Page', () => {
    beforeEach(() => {
        teardown();
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();
        datasetImportPage.importDataset('dataset/subresources-data.json');
        navigationPage.goToDisplay();

        cy.get('.sidebar')
            .contains('Resources')
            .click();
        cy.get('.sidebar')
            .contains('Subresources')
            .click();
    });

    it('should allow to add a subresource', () => {
        subresourcePage.createSubresource();
    });

    it('should allow to add a subresource field', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'myField', false);

        cy.get('.wizard')
            .find('#value-preview')
            .each((item, index) => {
                cy.wrap(item).should(
                    'contain.text',
                    ['Canidae', 'Felinae', 'Canidae'][index],
                );
            });

        cy.get('.wizard')
            .find('.btn-save')
            .click();

        cy.get('.wizard', { timeout: 2000 }).should('not.exist');

        cy.contains('button', 'Published data').click();
        cy.contains('.publication-excerpt-column', 'myField').should('exist');
    });

    it('should successfully publish subresources', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'myField');

        navigationPage.publishAndGoToPublishedData();
    });

    it('should allow to create link to subresource', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'myField');

        cy.get('.sidebar')
            .contains('a', 'Main resource')
            .click();

        cy.url().should('contain', '/display/document/main');
        cy.wait(200); // fix unexpected refresh after page change

        cy.contains('New field').click();
        cy.get('.wizard', { timeout: 10000 }).should('be.visible');
        cy.get('.wizard')
            .find(`input[name="label"]`)
            .clear()
            .type('Resource field');

        cy.contains('From Subresource').click();

        cy.get('#tab-display').click();

        datasetImportPage.fillTabDisplayFormat('link');

        cy.get('.wizard')
            .find('.btn-save')
            .click();

        cy.get('.wizard').should('not.exist');

        datasetImportPage.addColumn('name', { syndication: 1 });

        cy.get('.sidebar')
            .contains('Search')
            .click();
        cy.get('[data-testid="autocomplete_search_in_fields"]').click();
        cy.get('[role="listbox"]')
            .contains('Resource field')
            .click();

        navigationPage.publishAndGoToPublishedData();

        menu.openSearchDrawer();
        searchDrawer.findSearchResultByTitle('Publication n°1').click();

        cy.location('pathname').should('not.equal', '/');
    });

    it('should allow to create named link to subresource', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'Name');

        cy.contains('button', 'Published data').click();
        cy.contains('.publication-excerpt-column', 'Name').should('exist');

        cy.get('.sidebar')
            .contains('a', 'Main resource')
            .click();

        cy.url().should('contain', '/display/document/main');
        cy.wait(200); // fix unexpected refresh after page change

        // Add subresource data to main resource

        cy.contains('New field').click();
        cy.get('.wizard', { timeout: 10000 }).should('be.visible');

        cy.get('input[name="label"]')
            .clear()
            .type('Animal name');

        cy.contains('From Subresource').click();

        cy.get('[data-testid="autocomplete-subresource-label"]').click();

        cy.get('[role="listbox"]')
            .contains('name')
            .click();

        cy.get('.wizard')
            .find('.btn-save')
            .click();

        cy.get('.wizard').should('not.exist');

        cy.contains('button', 'Published data').click();

        let fieldName;
        cy.contains('span', 'Animal name')
            .parent('p')
            .within(() => {
                cy.get('span[data-field-name]')
                    .invoke('attr', 'data-field-name')
                    .then(fieldNameAttrValue => {
                        fieldName = fieldNameAttrValue;
                    });
            });

        // Add subresource link using previously created field

        cy.contains('button', 'Page').click();
        cy.contains('New field').click();
        cy.get('.wizard', { timeout: 10000 }).should('be.visible');

        cy.get('input[name="label"]')
            .clear()
            .type('Animal link');

        cy.contains('From Subresource').click();

        cy.get('#tab-display').click();

        datasetImportPage.fillTabDisplayFormat('link');
        cy.contains('The column content').click();
        cy.get(`[role="listbox"] li[data-value="column"]`).click();
        cy.get(`[role="listbox"]`).should('not.be.visible');
        cy.contains('label', 'Custom text')
            .parent('div')
            .within(() => {
                cy.get('input').type(fieldName);
            });

        cy.get('.wizard')
            .find('.btn-save')
            .click();

        cy.get('.wizard').should('not.exist');

        datasetImportPage.addColumn('name', { syndication: 1 });

        cy.get('.sidebar')
            .contains('Search')
            .click();
        cy.get('[data-testid="autocomplete_search_in_fields"]').click();
        cy.get('[role="listbox"]')
            .contains('Animal link')
            .click();

        navigationPage.publishAndGoToPublishedData();

        menu.openSearchDrawer();
        searchDrawer.findSearchResultByTitle('Publication n°1').click();

        cy.location('pathname').should('not.equal', '/');

        cy.contains('.property', 'Animal name').within(() => {
            cy.contains('Canidae').should('be.visible');
        });

        cy.contains('.property', 'Animal link').within(() => {
            cy.contains('Canidae').should('be.visible');
        });
    });
});
