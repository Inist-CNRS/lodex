export function enableMultilingual() {
    cy.get('.css-gmuwbf > .MuiButtonBase-root').click();
    cy.get('[aria-label="Settings"]').click();

    cy.get('.ace_content').type(
        '{selectAll}{rightArrow}{upArrow}{leftArrow}{leftArrow}{backspace}{backspace}{backspace}{backspace}{backspace}true',
    );

    cy.wait(250);
    cy.intercept('PUT', '/api/config-tenant/*').as('saveConfig');
    cy.get('.container > .MuiButton-contained').click();
    cy.wait('@saveConfig');
}

export function disableMultilingual() {
    cy.get('.css-gmuwbf > .MuiButtonBase-root').click();
    cy.get('[aria-label="Settings"]').click();

    cy.get('.ace_content').type(
        '{selectAll}{rightArrow}{upArrow}{leftArrow}{leftArrow}{backspace}{backspace}{backspace}{backspace}false',
    );

    cy.wait(250);
    cy.intercept('PUT', '/api/config-tenant/*').as('saveConfig');
    cy.get('.container > .MuiButton-contained').click();
    cy.wait('@saveConfig');
}
