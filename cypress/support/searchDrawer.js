export const openSearchDrawer = () => {
    cy.get('.drawer-container').should('exist');

    cy
        .get('.drawer-container')
        .children()
        .first()
        // force click because the element is position:fixed and partially hidden
        .click({ force: true });

    cy.get('.drawer-container .drawer').should('be.visible');
};

export const search = value => {
    cy.get('.drawer-container .search-bar').should('be.visible');
    cy.get('.drawer-container .drawer input[type="text"]').type(value);
    cy.wait(500); // Wait for the debounce
};

export const findSearchResultByTitle = value =>
    cy
        .get('.drawer-container .search-result-title')
        .contains(value)
        .parent();

export const loadMore = () => {
    cy.get('.drawer-container .load-more button').click();
};
