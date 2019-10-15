export const openAdvancedDrawer = () => {
    cy.get('.drawer').should('exist');

    cy.get('nav div')
        .contains('Advanced')
        .click();

    cy.wait(300);
    cy.get('.drawer .advanced-page').should('be.visible');
};

export const goToAdminDashboard = () => {
    cy.get('.advanced-page a')
        .contains('Admin')
        .click();
    cy.location('pathname').should('equal', '/admin');
};

export const goToGraphPage = () => {
    cy.visit('/graph');
    cy.location('pathname').should('equal', '/graph');
};

export const openChartDrawer = () => {
    cy.get('.advanced-page a')
        .contains('Graphs')
        .click();
    cy.get('.graph-summary').should('be.visible');
};

export const goToChart = name => {
    cy.get('.graph-link')
        .contains(name)
        .click();
    cy.wait(500);
    cy.get('.loading').should('not.be.visible');
    cy.get('.graph .title')
        .contains(name)
        .should('be.visible');
};

export const checkCharacteristicsOrder = names => {
    names.forEach((name, index) =>
        cy
            .get(`.property:nth-child(${index + 1})`)
            .contains(name)
            .should('be.visible'),
    );
};
