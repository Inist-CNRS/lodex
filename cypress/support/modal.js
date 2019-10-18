export const getModal = () => cy.get('.dialog-body').should('exist');

export const getModalTitle = () => cy.get('.dialog-content h3').should('exist');

export const getModalContent = () => cy.get('.dialog-content').should('exist');

export const getModalActions = () => cy.get('.dialog-actions').should('exist');
