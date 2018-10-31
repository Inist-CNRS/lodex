export const checkColumnHeaders = headers => {
    headers.forEach((col, index) => {
        cy.get(`.dataset table thead th:nth-child(${index + 1})`)
            .contains(col)
            .should('be.visible');
    });
};

export const expectRowsCountToBe = expected => {
    cy.get('.dataset table tbody')
        .find('tr')
        .should('have.length', expected);
};

export const createResource = resource => {
    cy.get('button.create-resource').click();

    Object.entries(resource).forEach(([field, value]) => {
        cy.get('label')
            .contains(field)
            .parent()
            .find('input')
            .type(value);
    });

    cy.get('button.create-resource.save').click();
    cy.location('pathname').should('not.equal', '/graph');
};

export const goToResourceFromRowContaining = selector => {
    selector
        .parentsUntil('tbody')
        .last() // <tr>
        .find('a')
        .click();

    cy.location('pathname').should('not.equal', '/graph');
};

export const goToResourceNumber = nb => {
    cy.get(`tr:nth-child(${nb}) .dataset-uri`).click();
    cy.location('pathname').should('not.equal', '/graph');
};

export const getSearchInput = () => cy.get('.filter input[type=text]');

export const searchFor = text => {
    getSearchInput().type(text);
    cy.get('.loading').should('exist');
    cy.get('.loading').should('not.exist');
};

export const getFacet = name => cy.get('.facet-item').contains(name);

export const getFacetItem = (name, value) =>
    getFacet(name)
        .parentsUntil('.facet-list > div')
        .last()
        .next() // .facet-value-list next to the .facet-item
        .find('.facet-value-item')
        .contains(value)
        .parentsUntil('.facet-value-item')
        .last();

export const setFacet = (name, value) => {
    getFacet(name).click();
    getFacetItem(name, value).click();
    getFacet(name).click();
};
