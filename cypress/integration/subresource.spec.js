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
            .contains('a', 'Resource pages')
            .click({ force: true });
    });

    it('should allow to add a subresource', () => {
        subresourcePage.createSubresource();
    });

    it('should allow to add a subresource field', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'myField', false);

        cy.get('.publication-excerpt-for-edition tbody tr td').each(
            (item, index) => {
                cy.wrap(item).should(
                    'contain.text',
                    ['Canidae', 'Felinae', 'Canidae'][index],
                );
            },
        );

        cy.get('.btn-save').click();
        cy.get('div[role="none presentation"]').should('not.exist');
        cy.contains('.publication-excerpt-column', 'myField').should('exist');
    });

    it('should show number of duplicate fields before publish', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'myField');

        cy.contains('button', 'Publish').click();

        cy.contains(
            '1 subresource(s) are duplicated will not be published',
        ).should('exist');

        cy.contains('Animals: 1').should('exist');
    });

    it('should successfully publish subresources', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'myField');

        navigationPage.publishAndGoToPublishedData(true);
    });

    it('should allow to create link to subresource', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'myField');

        cy.get('.sub-sidebar')
            .contains('a', 'Main resource')
            .click();

        cy.url().should('contain', '/display/document/main');
        cy.wait(200); // fix unexpected refresh after page change

        cy.contains('New field').click();
        cy.get('.wizard', { timeout: 10000 }).should('be.visible');

        cy.get('#step-value')
            .click()
            .scrollIntoView();

        cy.get('#step-value-subresource input[value="subresource"]').click();

        cy.get('#step-display')
            .click()
            .scrollIntoView();

        datasetImportPage.fillStepDisplayFormat('link');

        cy.get('.btn-save').click();
        cy.get('div[role="none presentation"]').should('not.exist');

        cy.contains('From a column').click();
        datasetImportPage.addColumn('name', { display: { syndication: 1 } });

        navigationPage.publishAndGoToPublishedData(true);

        menu.openSearchDrawer();
        searchDrawer.findSearchResultByTitle('Publication n°1').click();

        cy.location('pathname').should('not.equal', '/');
        cy.contains('a', 'uid:/').should('be.visible');
    });

    it('should allow to create named link to subresource', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'Name');

        cy.contains('.publication-excerpt-column', 'Name').should('exist');

        cy.get('.sub-sidebar')
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

        cy.get('#step-value')
            .click()
            .scrollIntoView();

        cy.get(
            '#step-value-subresource-field input[value="subresource"]',
        ).click();

        cy.get('#step-value-subresource-field .column_name').type('name');

        cy.get('.btn-save').click();
        cy.get('div[role="none presentation"]').should('not.exist');

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

        cy.contains('New field').click();
        cy.get('.wizard', { timeout: 10000 }).should('be.visible');

        cy.get('input[name="label"]')
            .clear()
            .type('Animal link');

        cy.get('#step-value')
            .click()
            .scrollIntoView();

        cy.get('#step-value-subresource input[value="subresource"]').click();

        cy.get('#step-display')
            .click()
            .scrollIntoView();

        datasetImportPage.fillStepDisplayFormat('link');
        cy.contains('The column content').click();
        cy.get(`[role="listbox"] li[data-value="column"]`).click();
        cy.get(`[role="listbox"]`).should('not.be.visible');
        cy.contains('label', 'Custom text')
            .parent('div')
            .within(() => {
                cy.get('input').type(fieldName);
            });

        cy.get('.btn-save').click();
        cy.get('div[role="none presentation"]').should('not.exist');

        cy.contains('From a column').click();
        datasetImportPage.addColumn('name', { display: { syndication: 1 } });

        navigationPage.publishAndGoToPublishedData(true);

        menu.openSearchDrawer();
        searchDrawer.findSearchResultByTitle('Publication n°1').click();

        cy.location('pathname').should('not.equal', '/');
        cy.contains('a', 'uid:/').should('be.visible');

        cy.contains('.property', 'Animal name').within(() => {
            cy.contains('Canidae').should('be.visible');
        });

        cy.contains('.property', 'Animal link').within(() => {
            cy.contains('Canidae').should('be.visible');
        });
    });
});
