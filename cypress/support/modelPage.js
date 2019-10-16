export const changeFilter = value => {
    cy.get('.select-filter button').click();
    cy.get('div[role="menu"] span[role="menuitem"]')
        .contains(value)
        .click();
};

export const checkFieldOrder = type => names => {
    cy.get(`.ontology-table-${type} table tbody tr`).should(
        'have.length',
        names.length,
    );
    names.forEach((name, i) => {
        cy.get(`.ontology-table-${type} table tbody tr:nth-child(${i + 1})`)
            .contains(name)
            .should('be.visible');
    });
};

export const checkDatasetFieldOrder = checkFieldOrder('dataset');

export const checkDocumentFieldOrder = checkFieldOrder('document');

export const dragField = type => (source, target) => {
    cy.get(
        `.ontology-table-${type} table tbody tr:nth-child(${source}) .drag-handle`,
    ).trigger('mousedown');
    cy.get(`.ontology-table-${type} table tbody tr:nth-child(${target})`)
        .trigger('mousemove')
        .trigger('mouseup');
};

export const dragDatasetField = dragField('dataset');
export const dragDocumentField = dragField('document');

export const goToDatasetImportPage = () =>
    cy
        .get('a')
        .contains('Lodex')
        .click();
