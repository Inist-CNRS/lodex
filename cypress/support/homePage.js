export const goToAdminDashboard = () => {
    cy.get('nav a')
        .contains('Admin')
        .click();
    cy.location('pathname').should('equal', '/admin');
};

export const goToGraphPage = () => {
    cy.visit('/graph'); // TODO revert to a click on link once new navigation is complete
    cy.location('pathname').should('equal', '/graph');
};

export const checkCharacteristicsOrder = names => {
    names.forEach((name, index) =>
        cy
            .get(`.property:nth-child(${index + 1})`)
            .contains(name)
            .should('be.visible'),
    );
};
