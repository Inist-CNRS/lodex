import * as adminNavigation from './adminNavigation';

export const openEnrichment = () => {
    adminNavigation.goToData();
    cy.get('.sidebar').contains('Enrichment').click({ force: true });
    cy.waitForNetworkIdle(500);
};

export const fillAdvancedEnrichment = (name = 'Enrichment') => {
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
    cy.contains('Add more').click();
    cy.waitForNetworkIdle(500);
    cy.findByLabelText('Name *').type(name);
    cy.contains('Advanced mode').click({ force: true });
    cy.get('textarea').type(rule, { force: true });
    cy.waitForNetworkIdle(500);
    cy.contains('Save').click({
        force: true,
    });
    cy.waitForNetworkIdle(500);
    cy.contains('Enrichment added successfully').should('exist');
};

export const updateNameEnrichment = () => {
    cy.findByLabelText('Name *').clear();
    cy.findByLabelText('Name *').type('Enrichment');
    cy.contains('Save').click({
        force: true,
    });
    cy.waitForNetworkIdle(500);
    cy.reload();
    cy.waitForNetworkIdle(500);
    cy.findByLabelText('Name *').should('have.value', 'Enrichment');
};

export const runEnrichment = () => {
    cy.contains('Run').click({
        force: true,
    });
    cy.get('.progress-container').should('be.visible');
    cy.waitForNetworkIdle(500);
};

export const checkIfEnrichmentExistInDataset = () => {
    cy.get('[data-field="Enrichment"]').should('exist');
};
