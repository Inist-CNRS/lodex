export const clearWorkers = async () => {
    cy.findByLabelText('Open menu').click();
    cy.findByRole('menuitem', { name: 'Advanced' }).click();
    cy.findByRole('menuitem', { name: 'Clear jobs' }).click();
};
