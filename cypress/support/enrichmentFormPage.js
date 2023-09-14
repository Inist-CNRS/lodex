import * as adminNavigation from './adminNavigation';

export const openEnrichment = () => {
    adminNavigation.goToData();
    cy.get('.sidebar')
        .contains('Enrichment')
        .click({ force: true });
};

export const fillAdvancedEnrichment = () => {
    const rule = `
    [use]
    plugin = basics

    [validate]
    path = id
    rule = required

    path = value
    rule = required

    [assign]
    path = value
    value = get("value.Column 1")

    [debug]`;
    cy.contains('Add more', { timeout: 500 }).click();
    cy.get('input[name="name"]', { timeout: 12000 }).type('Enrichment');
    cy.contains('Advanced mode').click({ force: true });
    cy.get('textarea', { timeout: 3000 }).type(rule, { force: true });
    cy.contains('Save', { timeout: 500 }).click({
        force: true,
    });
    cy.wait(3000);
};

export const runEnrichment = () => {
    cy.contains('Run', { timeout: 1500 }).click({
        force: true,
    });
    cy.get('.progress-container', { timeout: 2500 }).should('be.visible');
};

export const checkIfEnrichmentExistInDataset = () => {
    cy.get('[data-field="Enrichment"]', { timeout: 500 }).should('exist');
};
