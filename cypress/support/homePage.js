export const goToAdminDashboard = () => {
    cy.get('nav a[href="/admin"]').click();
    cy.location('pathname').should('equal', '/admin');
};

export const goToGraphPage = () => {
    cy.get('nav a[href="/graph"]').click();
    cy.location('pathname').should('equal', '/graph');
};
