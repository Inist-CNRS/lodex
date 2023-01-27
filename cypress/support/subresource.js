const defaultSubresource = {
    name: 'Animals',
    path: 'most_found_animal_species',
    identifier: 'id',
};

export const fillSubcategoryFormAndSubmit = values => {
    Object.keys(values).forEach(key => {
        cy.get(`[aria-label="input-${key}"]`).type(values[key]);
    });

    cy.get('button[type="submit"]').click();
};

export const addField = (name, label, save = true) => {
    cy.get('.field-grid').should('exist');
    cy.contains('button', 'New field').click();

    cy.get('.wizard').should('exist');

    cy.get('.wizard')
        .find(`input[name="label"]`)
        .clear()
        .type(label);

    cy.contains('Existing Column(s)').click();
    cy.get('[data-testid="source-value-from-columns"]').click();

    cy.get('[role="listbox"]')
        .contains(name)
        .click();

    if (save) {
        cy.get('.wizard')
            .find('.btn-save')
            .click();

        cy.get('.wizard').should('not.exist');

        cy.contains('button', 'Published data').click();
        cy.contains('.publication-excerpt-column', label).should('exist');
    }
};

export const createSubresource = (subresource = defaultSubresource) => {
    cy.contains('a', 'New subresource').click();

    cy.url().should('contain', '/display/document/add');

    fillSubcategoryFormAndSubmit(subresource);

    cy.get('.sub-sidebar')
        .contains('Animals')
        .should('be.visible');

    cy.url().should('not.contain', '/display/document/add');
};
