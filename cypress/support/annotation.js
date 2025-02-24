export function openAnnotationModalForField(fieldLabel) {
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

export function targetSection() {
    cy.findByRole('menuitem', {
        name: 'Comment the section',
        timeout: 1500,
    }).click();
}

export function goToNextStep() {
    cy.findByRole('button', { name: 'Next', timeout: 1500 }).click();
    cy.wait(350);
}

function chooseValueToComment(value) {
    cy.findByLabelText('Choose value to comment *').click();
    cy.findByText(value).click();
}

export function fillComment(comment) {
    cy.findByRole('textbox', { name: 'Comment *', timeout: 1500 }).type(
        comment,
    );
}

export function authorNameField() {
    return cy.findByRole('textbox', {
        name: 'Last name, First name *',
        timeout: 1500,
    });
}

export function authorEmailField() {
    return cy.findByRole('textbox', {
        name: 'Email address',
        timeout: 1500,
    });
}

export function authorRememberMeField() {
    return cy.findByRole('checkbox', {
        name: 'Remember my information',
        timeout: 1500,
    });
}

function fillAuthor({ authorName, authorEmail, authorRememberMe }) {
    authorNameField().type(authorName);

    if (authorEmail) {
        authorEmailField().type(authorEmail);
    }

    if (authorRememberMe) {
        authorRememberMeField().check();
    } else {
        authorRememberMeField().uncheck();
    }
}

export function submitAnnotation() {
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
    authorRememberMe = false,
}) {
    openAnnotationModalForField(fieldLabel);

    targetSection();

    fillComment(comment);
    goToNextStep();
    fillAuthor({ authorName, authorEmail, authorRememberMe });

    submitAnnotation();
}

export function checkFieldAnnotations({
    fieldLabel,
    expectedAnnotations,
    resourceTitle,
}) {
    openAnnotationModalForField(fieldLabel);

    if (expectedAnnotations.length === 0) {
        cy.findByText('No annotations on this field yet').should('be.visible');
        return;
    }

    cy.findByText(
        expectedAnnotations.length === 1
            ? `See 1 annotation`
            : `See ${expectedAnnotations.length} annotations`,
    ).should('be.visible');
    cy.findByText(
        expectedAnnotations.length === 1
            ? `See 1 annotation`
            : `See ${expectedAnnotations.length} annotations`,
    ).click();

    cy.findByLabelText('Resource title').should('have.text', resourceTitle);
    cy.findAllByLabelText('Type').should(
        'have.length',
        expectedAnnotations.length,
    );
    cy.findAllByLabelText('Annotation summary').should(
        'have.length',
        expectedAnnotations.length,
    );
    cy.findAllByLabelText('Status').should(
        'have.length',
        expectedAnnotations.length,
    );

    expectedAnnotations.forEach((annotation, index) => {
        cy.findAllByLabelText('Type')
            .eq(index)
            .should('have.text', annotation.kind);

        cy.findAllByLabelText('Annotation summary')
            .eq(index)
            .should('have.text', annotation.summaryValue);

        cy.findAllByLabelText('Status')
            .eq(index)
            .should('have.text', annotation.status);
    });

    cy.findByLabelText('close').click();
    cy.findByText('Cancel').click();
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

export function createAddValueWithSingleProposedValueChoiceAnnotation({
    fieldLabel,
    proposedValue,
    comment,
    authorName,
    authorEmail,
}) {
    openAnnotationModalForField(fieldLabel);

    targetValue();

    chooseKindAdd();

    cy.findByRole('combobox', { name: 'Proposed Value *' }).click();
    cy.findByRole('option', { name: proposedValue }).click();

    fillComment(comment);
    goToNextStep();
    fillAuthor({ authorName, authorEmail });

    submitAnnotation();
}

export function createAddValueWithMultipleProposedValuesChoiceAnnotation({
    fieldLabel,
    proposedValues,
    comment,
    authorName,
    authorEmail,
}) {
    openAnnotationModalForField(fieldLabel);

    targetValue();

    chooseKindAdd();

    for (const proposedValue of proposedValues) {
        cy.findByRole('combobox', { name: 'Proposed Value *' }).click();
        cy.findByRole('option', { name: proposedValue }).click();

        cy.findByRole('button', { name: proposedValue }).should('be.visible');
    }

    fillComment(comment);
    goToNextStep();
    fillAuthor({ authorName, authorEmail });

    submitAnnotation();
}
