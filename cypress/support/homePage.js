export const checkCharacteristicsOrder = names => {
    names.forEach((name, index) => {
        cy.get('.property')
            .eq(index)
            .contains(name)
            .should('be.visible');
    });
};
