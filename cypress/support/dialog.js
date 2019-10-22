export const getDialog = () => cy.get('.dialog-body').should('exist');

export const getDialogTitle = () =>
    cy.get('.dialog-content h3').should('exist');

export const getDialogContent = () => cy.get('.dialog-content').should('exist');

export const getDialogActions = () => cy.get('.dialog-actions').should('exist');
