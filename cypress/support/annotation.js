export function createAnnotation({ fieldLabel, comment }) {
    cy.findByRole('button', {
        name: `Add an annotation to ${fieldLabel} field`,
    }).click();

    if (comment) {
        cy.findByRole('textbox', { name: 'Comment', timeout: 1500 }).type(
            comment,
        );
    }

    cy.findByRole('button', { name: 'Validate', timeout: 1500 }).click();

    cy.findByText('Annotation created successfully', { timeout: 1500 }).should(
        'be.visible',
    );
}
