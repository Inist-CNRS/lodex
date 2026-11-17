function setMultilingual(value: boolean) {
    cy.get('.css-gmuwbf > .MuiButtonBase-root').click();
    cy.get('[aria-label="Settings"]').click();

    // Edit the JSON through Ace's API: simulated keystrokes were flaky and
    // could leave invalid JSON, which blocks the save.
    cy.get('.ace_editor').then(($editor) => {
        const editor = ($editor[0] as any).env.editor;
        const config = JSON.parse(editor.getValue());
        editor.setValue(
            JSON.stringify({ ...config, multilingual: value }, null, 4),
            -1,
        );
    });

    cy.intercept('PUT', '/api/config-tenant/*').as('saveConfig');
    cy.get('.container > .MuiButton-contained').click();
    cy.wait('@saveConfig');
}

export function enableMultilingual() {
    setMultilingual(true);
}

export function disableMultilingual() {
    setMultilingual(false);
}
