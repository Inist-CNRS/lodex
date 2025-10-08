export function openAnnotationModalForField(fieldLabel: string) {
    const buttonLabel = `Add an annotation to the ${fieldLabel} field`;
    cy.findByRole('button', {
        name: buttonLabel,
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
        name: 'Annotate the field',
        timeout: 1500,
    }).click();
}

export function goToNextStep() {
    cy.findByRole('button', { name: 'Next', timeout: 1500 }).click();
    cy.wait(350);
}

function chooseValueToComment(value: string) {
    cy.findByLabelText('Choose value to comment *').click();
    cy.findByText(value).click();
}

export function fillComment(comment: string) {
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

export function isContributorNamePublicField() {
    return cy.findByRole('checkbox', {
        name: 'I agree that my name may be visible to other contributors.',
        timeout: 1500,
    });
}

function fillAuthor({
    authorName,
    authorEmail,
    isContributorNamePublic,
    authorRememberMe,
}: {
    authorName: string;
    authorEmail?: string;
    isContributorNamePublic?: boolean;
    authorRememberMe?: boolean;
}) {
    authorNameField().type(authorName);

    if (authorEmail) {
        authorEmailField().type(authorEmail);
    }

    if (isContributorNamePublic === true) {
        isContributorNamePublicField().check();
    } else if (isContributorNamePublic === false) {
        isContributorNamePublicField().uncheck();
    }

    if (authorRememberMe === true) {
        authorRememberMeField().check();
    } else if (authorRememberMe === false) {
        authorRememberMeField().uncheck();
    }
}

export function submitAnnotation() {
    cy.findByRole('button', { name: 'Validate', timeout: 1500 }).click();
    cy.findByText(
        'Your suggestion has been sent. We thank you for your contribution.',
        { timeout: 1500 },
    ).should('be.visible');
    cy.findByLabelText('close').click();
}

export function createAnnotationOnFieldWithNoValue({
    fieldLabel,
    comment,
    authorName,
    authorEmail,
    isContributorNamePublic,
    authorRememberMe,
}: {
    fieldLabel: string;
    comment: string;
    authorName: string;
    authorEmail?: string;
    isContributorNamePublic?: boolean;
    authorRememberMe?: boolean;
}) {
    openAnnotationModalForField(fieldLabel);

    fillComment(comment);

    goToNextStep();

    fillAuthor({
        authorName,
        authorEmail,
        isContributorNamePublic,
        authorRememberMe,
    });

    submitAnnotation();
}

export function createTitleAnnotation({
    fieldLabel,
    comment,
    authorName,
    authorEmail,
    isContributorNamePublic,
    authorRememberMe,
}: {
    fieldLabel: string;
    comment: string;
    authorName: string;
    authorEmail?: string;
    isContributorNamePublic?: boolean;
    authorRememberMe?: boolean;
}) {
    openAnnotationModalForField(fieldLabel);

    targetSection();

    fillComment(comment);
    goToNextStep();
    fillAuthor({
        authorName,
        authorEmail,
        isContributorNamePublic,
        authorRememberMe,
    });

    submitAnnotation();
}

const ANNOTATION_KIND_TRANSLATION = {
    removal: 'Removal',
    comment: 'Comment',
    correction: 'Correction',
    addition: 'Addition',
};

export function checkFieldAnnotations({
    fieldLabel,
    expectedAnnotations,
    resourceTitle,
}: {
    fieldLabel: string;
    expectedAnnotations: Array<{
        kind: string;
        summaryValue: string;
        status: string;
    }>;
    resourceTitle: string;
}) {
    openAnnotationModalForField(fieldLabel);

    if (expectedAnnotations.length === 0) {
        cy.findByText('No annotations yet').should('be.visible');
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
            .should('have.text', ANNOTATION_KIND_TRANSLATION[annotation.kind]);

        cy.findAllByLabelText('Annotation summary')
            .eq(index)
            .should('have.text', annotation.summaryValue);

        cy.findAllByLabelText('Status')
            .eq(index)
            .should('have.text', annotation.status);
    });

    cy.findAllByLabelText('close').then((elements) => {
        cy.wrap(elements[elements.length - 1]).click();
    });
    cy.findByText('Cancel').click();
}

export function createSingleValueAnnotation({
    fieldLabel,
    comment,
    authorName,
    authorEmail,
    isContributorNamePublic,
    authorRememberMe,
}: {
    fieldLabel: string;
    comment: string;
    authorName: string;
    authorEmail?: string;
    isContributorNamePublic?: boolean;
    authorRememberMe?: boolean;
}) {
    openAnnotationModalForField(fieldLabel);

    chooseKindRemoval();

    fillComment(comment);
    goToNextStep();
    fillAuthor({
        authorName,
        authorEmail,
        isContributorNamePublic,
        authorRememberMe,
    });

    submitAnnotation();
}

export function createMultiValueAnnotation({
    fieldLabel,
    comment,
    value,
    authorName,
    authorEmail,
    isContributorNamePublic,
    authorRememberMe,
}: {
    fieldLabel: string;
    comment: string;
    value: string;
    authorName: string;
    authorEmail?: string;
    isContributorNamePublic?: boolean;
    authorRememberMe?: boolean;
}) {
    openAnnotationModalForField(fieldLabel);

    chooseValueToComment(value);

    fillComment(comment);
    goToNextStep();
    fillAuthor({
        authorName,
        authorEmail,
        isContributorNamePublic,
        authorRememberMe,
    });

    submitAnnotation();
}

export function createAddValueWithSingleProposedValueChoiceAnnotation({
    fieldLabel,
    proposedValue,
    comment,
    authorName,
    authorEmail,
    isContributorNamePublic,
    authorRememberMe,
}: {
    fieldLabel: string;
    proposedValue: string;
    comment: string;
    authorName: string;
    authorEmail?: string;
    isContributorNamePublic?: boolean;
    authorRememberMe?: boolean;
}) {
    openAnnotationModalForField(fieldLabel);

    chooseKindAdd();

    cy.findByRole('combobox', { name: 'Proposed Value *' }).click();
    cy.findByRole('option', { name: proposedValue }).click();

    fillComment(comment);
    goToNextStep();
    fillAuthor({
        authorName,
        authorEmail,
        isContributorNamePublic,
        authorRememberMe,
    });

    submitAnnotation();
}

export function createAddValueWithMultipleProposedValuesChoiceAnnotation({
    fieldLabel,
    proposedValues,
    comment,
    authorName,
    authorEmail,
    isContributorNamePublic,
    authorRememberMe,
}: {
    fieldLabel: string;
    proposedValues: string[];
    comment: string;
    authorName: string;
    authorEmail?: string;
    isContributorNamePublic?: boolean;
    authorRememberMe?: boolean;
}) {
    openAnnotationModalForField(fieldLabel);

    chooseKindAdd();

    for (const proposedValue of proposedValues) {
        cy.findByRole('combobox', { name: 'Proposed Value *' }).click();
        cy.findByRole('option', { name: proposedValue }).click();

        cy.findByRole('button', { name: proposedValue }).should('be.visible');
    }

    fillComment(comment);
    goToNextStep();
    fillAuthor({
        authorName,
        authorEmail,
        isContributorNamePublic,
        authorRememberMe,
    });

    submitAnnotation();
}
