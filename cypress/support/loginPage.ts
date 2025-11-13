export const checkLoginPage = () => {
    cy.findByLabelText('Username *').should('be.visible');
    cy.findByLabelText('Password *').should('be.visible');
};
