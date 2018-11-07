export const openSearchDrawer = () => {
    cy.get('.drawer-container').should('exist');

    cy.get('nav div')
        .contains('Search')
        .click();

    cy.wait(300);
    cy.get('.drawer-container .drawer .search').should('be.visible');
};

export const openAdvancedSearchDrawer = () => {
    cy.get('.drawer-container .drawer .search').should('be.visible');

    cy.get('.search-advanced-toggle').click();
    cy.wait(300);
    cy.get('.drawer-container .drawer .advanced-search').should('be.visible');
};

export const searchInput = () =>
    cy.get('.drawer-container .drawer input[type="text"]');

export const search = value => {
    cy.get('.drawer-container .search-bar').should('be.visible');
    searchInput().type(value);
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

export const waitForLoading = () => {
    // This is the best way to wait for the loading to disappear so far
    // Because sometimes the loading doesn't appear at all
    cy.wait(500);
    cy.get('.graph-page .loading').should('not.exist');
};

export const getFacet = name =>
    cy.get('.advanced-search .facet-item').contains(name);

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
    waitForLoading();
};
