export const checkCharacteristicsOrder = names => {
    names.forEach((name, index) =>
        cy
            .get(`.property:nth-child(${index + 1})`)
            .contains(name)
            .should('be.visible'),
    );
};
