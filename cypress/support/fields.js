export function setFieldLanguage(fieldName, languageCode) {
    cy.contains('p', fieldName).trigger('mouseenter');
    cy.get(
        `[aria-label="edit-${fieldName}"] > [data-testid="SettingsIcon"]`,
    ).click();
    cy.get('#tab-semantics').click();
    cy.get('.MuiFormControl-root:nth-child(2)').click();
    cy.get(`[data-value="${languageCode}"]`).click();
    cy.get('[data-testid="SaveAsIcon"]').click();

    cy.wait(1000);
}

export function createNewField() {
    cy.findByRole('button', {
        name: /New field/,
    }).click();

    cy.findByRole('textbox', {
        name: /Label/,
    }).should('be.visible', {
        timeout: 1000,
    });

    cy.findByRole('button', {
        name: /Arbitrary value/,
    }).click();

    cy.findByPlaceholderText('Enter an arbitrary value').type('FIELD');

    cy.findByRole('button', {
        name: /Save/,
    }).click();
}
