export const goToAdminDashboard = () => {
    cy.get('a[href="/admin"]').click();
    cy.location('pathname').should('equal', '/admin');
};
