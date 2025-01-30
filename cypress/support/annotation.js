export function createAnnotation({
    fieldLabel,
    comment,
    authorName,
    authorEmail,
}) {
    cy.findByRole('button', {
        name: `Add an annotation to ${fieldLabel} field`,
    }).click();

    cy.findByRole('textbox', { name: 'Comment *', timeout: 1500 }).type(
        comment,
    );

    cy.findByRole('button', { name: 'Next', timeout: 1500 }).click();

    cy.wait(350);

    cy.findByRole('textbox', { name: 'Name *', timeout: 1500 }).type(
        authorName,
    );

    if (authorEmail) {
        cy.findByRole('textbox', { name: /Email/, timeout: 1500 }).type(
            authorEmail,
        );
    }

    cy.findByRole('button', { name: 'Validate', timeout: 1500 }).click();

    cy.findByText(
        'Your suggestion has been sent. We thank you for your contribution.',
        { timeout: 1500 },
    ).should('be.visible');
}
