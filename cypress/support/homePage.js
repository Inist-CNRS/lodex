export const checkCharacteristicsOrder = labels => {
    labels.forEach((label, index) => {
        cy.get('.property')
            .eq(index)
            .contains(label)
            .scrollIntoView()
            .should('be.visible');
        cy.wait(300);
    });
};

export const checkCharacteristic = (name, value) =>
    cy
        .get(`.property_value.${name}`)
        .contains(value)
        .scrollIntoView()
        .should('be.visible');
