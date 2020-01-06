export const checkCharacteristicsOrder = names => {
    names.forEach((name, index) => {
        cy.get('.property')
            .eq(index)
            .contains(name)
            .scrollIntoView()
            .should('be.visible');
        cy.wait(300);
    });
};
