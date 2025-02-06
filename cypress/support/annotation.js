function createAnnotation({ buttonLabel, comment, authorName, authorEmail }) {
    cy.findByRole('button', {
        name: buttonLabel,
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

export function createTitleAnnotation({
    fieldLabel,
    comment,
    authorName,
    authorEmail,
}) {
    createAnnotation({
        buttonLabel: `Add an annotation to the ${fieldLabel} field title`,
        fieldLabel,
        comment,
        authorName,
        authorEmail,
    });
}

export function createValueAnnotation({
    fieldLabel,
    comment,
    authorName,
    authorEmail,
}) {
    const buttonLabel = `Add an annotation to the ${fieldLabel} field value`;
    cy.findByRole('button', {
        name: buttonLabel,
    }).trigger('mouseenter');

    createAnnotation({
        buttonLabel,
        fieldLabel,
        comment,
        authorName,
        authorEmail,
    });
}
