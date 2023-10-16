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

[debug]

[throttle]
bySecond = 1
`;
    cy.contains('Add more', { timeout: 500 }).click();
    cy.get('input[name="name"]', { timeout: 12000 }).type('Enrichment');
    cy.contains('Advanced mode').click({ force: true });
    cy.get('textarea', { timeout: 3000 }).type(rule, { force: true });
    cy.wait(3000);
    cy.contains('Save', { timeout: 500 }).click({
        force: true,
    });
    cy.wait(6000);
};

export const runEnrichment = () => {
    cy.contains('Run', { timeout: 6000 }).click({
        force: true,
    });
    cy.get('.progress-container', { timeout: 4000 }).should('be.visible');
    cy.wait(3000);
};

export const checkIfEnrichmentExistInDataset = () => {
    cy.get('[data-field="Enrichment"]', { timeout: 500 }).should('exist');
};
