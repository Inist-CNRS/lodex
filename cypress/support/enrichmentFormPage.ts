import * as adminNavigation from './adminNavigation';

export const openEnrichment = () => {
    adminNavigation.goToData();
    cy.get('.sidebar').contains('Enrichment').click({ force: true });
    cy.waitForNetworkIdle(500);
};

// bySecond: the rows enriched per second
const advancedRule = (bySecond = 1) => `
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
bySecond = ${bySecond}
`;

export const fillAdvancedEnrichment = (name = 'Enrichment') => {
    const rule = advancedRule();
    cy.contains('Add more').click();
    cy.waitForNetworkIdle(500);
    cy.findByLabelText('Name *').type(name);
    cy.contains('Advanced mode').click({ force: true });
    cy.get('textarea').type(rule, { force: true });
    cy.waitForNetworkIdle(500);
    cy.contains('Save').click({
        force: true,
    });
    // The toast closes after 5s: check it before waiting for the network, which can take longer
    cy.contains('Enrichment added successfully').should('exist');
    cy.waitForNetworkIdle(2000);
};

// Through the API: the form previews the rule, which takes long when it is slow
export const createEnrichment = (name: string, bySecond = 1) =>
    cy.window().then((win) => {
        // the admin token, kept in the local storage by the app
        const storedState = Object.values(win.localStorage).find((value) =>
            String(value).includes('"token"'),
        ) as string;
        cy.request({
            method: 'POST',
            url: '/api/enrichment',
            headers: {
                Authorization: `Bearer ${JSON.parse(storedState).user.token}`,
            },
            body: {
                name,
                advancedMode: true,
                rule: advancedRule(bySecond),
                dataSource: 'dataset',
            },
        });
    });

export const updateNameEnrichment = () => {
    cy.findByLabelText('Name *').clear();
    cy.findByLabelText('Name *').type('Enrichment');
    cy.contains('Save').click({
        force: true,
    });
    cy.waitForNetworkIdle(1000);
    cy.reload();
    cy.waitForNetworkIdle(1000);
    cy.findByLabelText('Name *').should('have.value', 'Enrichment');
};

export const runEnrichment = () => {
    cy.contains('Run').click({
        force: true,
    });
    // the run of a small dataset can end before its progress shows: wait for
    // its end instead
    cy.contains('Done').should('be.visible');
    cy.waitForNetworkIdle(500);
};

export const checkIfEnrichmentExistInDataset = () => {
    cy.get('[data-field="Enrichment"]').should('exist');
};
