export function setFieldLanguage(fieldName: string, languageCode: string) {
    cy.contains('p', fieldName).trigger('mouseenter');
    cy.get(
        `[aria-label="edit-${fieldName}"] > [data-testid="SettingsIcon"]`,
    ).click();
    cy.get('#tab-semantics').click();
    cy.findByLabelText('Language').click();
    cy.get(`[data-value="${languageCode}"]`).click();
    // wait for the save itself: it can take more than a fixed delay
    cy.intercept('PATCH', '/api/field/*').as('saveField');
    cy.get('[data-testid="SaveAsIcon"]').click();
    cy.wait('@saveField');
}

export function createNewField({
    fieldIcons = [],
}: {
    fieldIcons?: string[];
} = {}) {
    cy.findByRole('button', {
        name: /New field/,
    }).click();

    cy.findByRole('textbox', {
        name: /Label/,
    }).should('be.visible', {
        timeout: 1000,
    });

    if (fieldIcons.length > 0) {
        fieldIcons.forEach((label) => {
            cy.get(`button > [aria-label="${label}"]`).click();
        });
    }

    cy.findByRole('button', {
        name: /Arbitrary value/,
    }).click();

    cy.findByPlaceholderText('Enter an arbitrary value').type('FIELD');

    cy.findByRole('button', {
        name: /Save/,
    }).click();
}
