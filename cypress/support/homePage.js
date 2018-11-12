export const goToAdminDashboard = () => {
    cy.get('nav a')
        .contains('Admin')
        .click();
    cy.location('pathname').should('equal', '/admin');
};

export const goToGraphPage = () => {
    cy.get('nav a')
        .contains('Resources')
        .click();
    cy.location('pathname').should('equal', '/graph');
};

export const openChartDrawer = () => {
    cy.get('nav a')
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
