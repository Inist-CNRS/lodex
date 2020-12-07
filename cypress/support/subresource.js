const defaultSubresource = {
    name: 'Foo',
    identifier: 'Bar',
    path: 'Path',
};

export const fillSubcategoryFormAndSubmit = values => {
    Object.keys(values).forEach(key => {
        cy.get(`input[name="${key}"]`).type(values[key]);
    });

    cy.get('button[type="submit"]').click();
};

export const addField = (name, label) => {
    cy.contains('div', 'No field set for this Subresource').within(() => {
        cy.get('button').click();
    });

    cy.get('div[role="none presentation"]')
        .should('exist')
        .find(`input[name="transformers[2].args[0].value"]`)
        .type(name);

    cy.get('div[role="none presentation"]')
        .should('exist')
        .find(`input[name="label"]`)
        .clear()
        .type(label);
};

export const createSubresource = (subresource = defaultSubresource) => {
    cy.contains('a', 'New subresource').click();

    cy.url().should('contain', '/display/document/add');

    fillSubcategoryFormAndSubmit(subresource);

    cy.get('.sub-sidebar')
        .contains('Foo')
        .should('be.visible');

    cy.url().should('not.contain', '/display/document/add');
};
