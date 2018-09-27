export const changeFilter = value => {
    cy.get('.select-filter button').click();
    cy
        .get('div[role="menu"] span[role="menuitem"]')
        .contains(value)
        .click();
};
