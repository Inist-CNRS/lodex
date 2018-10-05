export const checkColumnHeaders = headers => {
    headers.forEach((col, index) => {
        cy
            .get(`.dataset table thead th:nth-child(${index + 1})`)
            .contains(col)
            .should('be.visible');
    });
};

export const expectRowsCountToBe = expected => {
    cy
        .get('.dataset table tbody')
        .find('tr')
        .should('have.length', expected);
};

export const createResource = resource => {
    cy.get('button.create-resource').click();

    Object.entries(resource).forEach(([field, value]) => {
        cy
            .get('label')
            .contains(field)
            .parent()
            .find('input')
            .type(value);
    });

    cy.get('button.create-resource.save').click();
    cy.location('pathname').should('not.equal', '/graph');
};
