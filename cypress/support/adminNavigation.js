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
    cy.get('div[role="progressbar"]').should('not.be.visible');
};

export const publishAndGoToPublishedData = () => {
    cy.contains('button', 'Publish').click();
    cy.wait(500);
    cy.get('div[role="dialog"] div[role="progressbar"]', {
        timeout: 10000,
    }).should('not.be.visible');

    goToData();
    cy.get('.data-published').should('be.visible');
    goToPublishedResources();
};
