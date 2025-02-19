function openAnnotationModalForField(fieldLabel) {
    const buttonLabel = `Add an annotation to the ${fieldLabel} field`;
    cy.findByRole('button', {
        name: buttonLabel,
    }).click();
}

function targetValue() {
    cy.findByRole('menuitem', {
        name: 'Comment a value',
        timeout: 1500,
    }).click();
}

function chooseKindRemoval() {
    cy.findByRole('menuitem', {
        name: 'Remove some content',
        timeout: 1500,
    }).click();
}

function chooseKindAdd() {
    cy.findByRole('menuitem', {
        name: 'Add some content',
        timeout: 1500,
    }).click();
}

function targetSection() {
    cy.findByRole('menuitem', {
        name: 'Comment the section',
        timeout: 1500,
    }).click();
}

function goToNextStep() {
    cy.findByRole('button', { name: 'Next', timeout: 1500 }).click();
    cy.wait(350);
}

function chooseValueToComment(value) {
    cy.findByLabelText('Choose value to comment *').click();
    cy.findByText(value).click();
}

function fillComment(comment) {
    cy.findByRole('textbox', { name: 'Comment *', timeout: 1500 }).type(
        comment,
    );
}

function fillAuthor({ authorName, authorEmail }) {
    cy.findByRole('textbox', {
        name: 'Last name, First name *',
        timeout: 1500,
    }).type(authorName);

    if (authorEmail) {
        cy.findByRole('textbox', { name: /Email/, timeout: 1500 }).type(
            authorEmail,
        );
    }
}

function submitAnnotation() {
    cy.findByRole('button', { name: 'Validate', timeout: 1500 }).click();
    cy.findByText(
        'Your suggestion has been sent. We thank you for your contribution.',
        { timeout: 1500 },
    ).should('be.visible');
}

export function createAnnotationOnFieldWithNoValue({
    fieldLabel,
    comment,
    authorName,
    authorEmail,
}) {
    openAnnotationModalForField(fieldLabel);

    fillComment(comment);

    goToNextStep();

    fillAuthor({ authorName, authorEmail });

    submitAnnotation();
}

export function createTitleAnnotation({
    fieldLabel,
    comment,
    authorName,
    authorEmail,
}) {
    openAnnotationModalForField(fieldLabel);

    targetSection();

    fillComment(comment);
    goToNextStep();
    fillAuthor({ authorName, authorEmail });

    submitAnnotation();
}

export function createSingleValueAnnotation({
    fieldLabel,
    comment,
    authorName,
    authorEmail,
}) {
    openAnnotationModalForField(fieldLabel);

    targetValue();

    chooseKindRemoval();

    fillComment(comment);
    goToNextStep();
    fillAuthor({ authorName, authorEmail });

    submitAnnotation();
}

export function createMultiValueAnnotation({
    fieldLabel,
    comment,
    value,
    authorName,
    authorEmail,
}) {
    openAnnotationModalForField(fieldLabel);

    targetValue();

    chooseValueToComment(value);

    fillComment(comment);
    goToNextStep();
    fillAuthor({ authorName, authorEmail });

    submitAnnotation();
}

export function createAddValueWithProposedValueChoiceAnnotation({
    fieldLabel,
    proposedValue,
    comment,
    authorName,
    authorEmail,
}) {
    openAnnotationModalForField(fieldLabel);

    targetValue();

    chooseKindAdd();

    cy.findByLabelText('Proposed Value *').click();
    cy.findByRole('option', { name: proposedValue }).click();

    fillComment(comment);
    goToNextStep();
    fillAuthor({ authorName, authorEmail });

    submitAnnotation();
}
