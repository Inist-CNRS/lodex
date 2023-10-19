import { goToPublishedResources } from './datasetImportPage';

export const goToData = () => {
    cy.get('.appbar')
        .contains('Data')
        .click({ force: true }); // avoid bug due of detached DOM element

    cy.location('hash').should('equal', '#/data/existing');
};

export const goToDisplay = () => {
    cy.get('.appbar')
        .contains('Display')
        .click({ force: true }); // avoid bug due of detached DOM element

    cy.location('hash').should('equal', '#/display/dataset');
};

export const goToResourcePage = () => {
    cy.get('.appbar')
        .contains('Display')
        .click({ force: true }); // avoid bug due of detached DOM element

    cy.location('hash').should('equal', '#/display/dataset');
    cy.get('.sidebar')
        .contains('Main resource')
        .click();
    cy.wait(500);
    cy.location('hash').should('equal', '#/display/document/main');
};

export const publishAndGoToPublishedData = () => {
    cy.contains('button', 'Publish').click();
    cy.wait(500);
    cy.get('div[role="dialog"] div[role="progressbar"]', {
        timeout: 10000,
    }).should('not.exist');

    goToData();
    cy.get('[aria-label="unpublish"').should('be.visible');
    goToPublishedResources();
};
