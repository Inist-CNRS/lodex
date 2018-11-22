export const changeFormat = (field, format) => {
    cy.get(`.${field} .configure-field`).click();
    cy.get('#step-value-format>div>.select-format')
        .scrollIntoView()
        .click();

    cy.get('.select-format-item')
        .contains(format)
        .scrollIntoView()
        .click();
    cy.get('.configure-field.save').click();
};
