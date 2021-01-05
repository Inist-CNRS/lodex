import { teardown } from '../support/authentication';
import * as menu from '../support/menu';
import * as navigationPage from '../support/adminNavigation';
import * as datasetImportPage from '../support/datasetImportPage';
import * as subresourcePage from '../support/subresource';
import * as searchDrawer from '../support/searchDrawer';

describe('Subresource Page', () => {
    const dataset = 'dataset/subresources-data.json';

    beforeEach(() => {
        teardown();
        menu.openAdvancedDrawer();
        menu.goToAdminDashboard();
        datasetImportPage.importDataset(dataset);
        navigationPage.goToDisplay();
        cy.get('.sidebar')
            .contains('a', 'Resource pages')
            .click();
        datasetImportPage.setUriColumnValue();

        cy.get('.sidebar')
            .contains('a', 'Resource pages')
            .click({ force: true });
    });

    it('should allow to add a subresource', () => {
        subresourcePage.createSubresource();
    });

    it('should allow to add a subresource field', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'myField');

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

        cy.get('.btn-save').click();
        cy.get('div[role="none presentation"]').should('not.exist');
        cy.contains('.publication-excerpt-column', 'myField').should('exist');

        cy.contains('button', 'Publish').click();

        cy.contains(
            '1 subresource(s) are duplicated will not be published',
        ).should('exist');

        cy.contains('Animals: 1').should('exist');
    });

    it('should successfully publish subresources', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'myField');

        cy.get('.btn-save').click();
        cy.get('div[role="none presentation"]').should('not.exist');
        cy.contains('.publication-excerpt-column', 'myField').should('exist');

        cy.contains('button', 'Publish').click();
        cy.contains('Publish anyway?').click();

        cy.wait(500);
        cy.get('div[role="dialog"] div[role="progressbar"]', {
            timeout: 10000,
        }).should('not.be.visible');

        navigationPage.goToData();
        cy.get('.data-published').should('be.visible');
        datasetImportPage.goToPublishedResources();
    });

    it('should allow to create link to subresource', () => {
        subresourcePage.createSubresource();
        subresourcePage.addField('name', 'myField');
        cy.get('.btn-save').click();
        cy.get('div[role="none presentation"]').should('not.exist');

        cy.contains('.publication-excerpt-column', 'myField').should('exist');

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

        cy.contains('button', 'Publish').click();
        cy.contains('Publish anyway?').click();

        cy.wait(500);
        cy.get('div[role="dialog"] div[role="progressbar"]', {
            timeout: 10000,
        }).should('not.be.visible');

        navigationPage.goToData();
        cy.get('.data-published').should('be.visible');
        datasetImportPage.goToPublishedResources();

        menu.openSearchDrawer();
        searchDrawer.findSearchResultByTitle('Publication n°1').click();

        cy.location('pathname').should('not.equal', '/');
        cy.contains('a', 'uid:/').should('be.visible');
    });
});
