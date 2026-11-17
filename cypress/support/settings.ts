// Edit the config through the ace editor API: typing arrow keys in the editor
// depends on line wrapping and on the current value (true or false), which
// made these helpers fail, and fail again on retries once the value changed.
function setMultilingual(multilingual: boolean) {
    cy.get('.css-gmuwbf > .MuiButtonBase-root').click();
    cy.get('[aria-label="Settings"]').click();

    cy.get('.ace_editor')
        .should(($editor) => {
            expect(($editor[0] as any).env.editor.getValue()).to.contain(
                '"front"',
            );
        })
        .then(($editor) => {
            const editor = ($editor[0] as any).env.editor;
            const config = JSON.parse(editor.getValue());
            config.front.multilingual = multilingual;
            editor.setValue(JSON.stringify(config, null, 2));
        });

    cy.intercept('PUT', '/api/config-tenant/*').as('saveConfig');
    cy.get('.container > .MuiButton-contained').click();
    cy.wait('@saveConfig')
        .its('request.body.front.multilingual')
        .should('equal', multilingual);
}

export const enableMultilingual = () => setMultilingual(true);

export const disableMultilingual = () => setMultilingual(false);
