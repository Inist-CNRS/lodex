export const getDialog = () => cy.get('div[role=dialog]').should('exist');

export const getDialogTitle = () =>
    cy.get('div[role=dialog] h2').should('exist');

export const getDialogContent = () => cy.get('.dialog-content').should('exist');

export const getDialogActions = () => cy.get('.dialog-actions').should('exist');
