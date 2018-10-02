export const goToAdminDashboard = () => {
    cy
        .get('nav a')
        .contains('Administration')
        .click();
    cy.location('pathname').should('equal', '/admin');
};

export const goToGraphPage = () => {
    cy
        .get('nav a')
        .contains('Resources')
        .click();
    cy.location('pathname').should('equal', '/graph');
};

export const checkCharacteristicsOrder = names => {
    names.forEach((name, index) =>
        cy.get(`.property:nth-child(${index + 1})`).contains(name),
    );
};
