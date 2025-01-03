import * as ace from 'ace-builds';

export function enableMultilingual() {
    cy.get('.css-gmuwbf > .MuiButtonBase-root').click();
    cy.get('[aria-label="config"]').click();

    cy.get('.ace_content').type(
        '{selectAll}{rightArrow}{upArrow}{leftArrow}{leftArrow}{backspace}{backspace}{backspace}{backspace}{backspace}true',
    );

    cy.wait(250);
    cy.get('.container > .MuiButton-contained').click();
    cy.wait(1000);
}
