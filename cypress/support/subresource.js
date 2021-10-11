const defaultSubresource = {
    name: 'Animals',
    identifier: 'id',
    path: 'most_found_animal_species',
};

export const fillSubcategoryFormAndSubmit = values => {
    Object.keys(values).forEach(key => {
        cy.get(`input[name="${key}"]`).type(values[key]);
    });

    cy.get('button[type="submit"]').click();
};

export const addField = (name, label, save = true) => {
    cy.contains('button', 'New field').click();

    cy.get('div[role="dialog"]').should('exist');

    cy.get('div[role="dialog"]')
        .find(`input[name="transformers[2].args[0].value"]`)
        .type(name);

    cy.get('div[role="dialog"]')
        .find(`input[name="label"]`)
        .clear()
        .type(label);

    if (save) {
        cy.get('div[role="dialog"]')
            .find('.btn-save')
            .click();

        cy.get('div[role="dialog"]').should('not.exist');

        cy.contains('button', 'Données publiées').click();
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
