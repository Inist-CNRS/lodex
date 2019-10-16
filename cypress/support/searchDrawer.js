export const openSearchDrawer = () => {
    cy.get('.drawer').should('exist');

    cy.get('nav div')
        .contains('Search')
        .click();

    cy.wait(300);
    cy.get('.drawer .search .search-header').should('be.visible');
};

export const searchInput = () => cy.get('.drawer input[type="text"]');

export const search = value => {
    cy.get('.drawer .search-bar')
        .scrollIntoView()
        .should('be.visible');
    searchInput().type(value);
    cy.wait(500); // Wait for the debounce
};

export const findSearchResultByTitle = value =>
    cy
        .get('.drawer .search-result-title')
        .contains(value)
        .parent();

export const checkResultList = titles => {
    titles.forEach((title, index) => {
        cy.get(
            `.search-result-link:nth-child(${index + 1}) .search-result-title`,
        )
            .contains(title)
            .scrollIntoView()
            .should('be.visible');
    });
};

export const loadMore = () => {
    cy.get('.drawer .load-more button').click();
};

export const waitForLoading = () => {
    // This is the best way to wait for the loading to disappear so far
    // Because sometimes the loading doesn't appear at all
    cy.wait(1000);
    cy.get('.graph-page .loading').should('not.exist');
};

export const getFacetsOrder = facets => {
    facets.forEach((name, index) => {
        cy.get(`.facet-list > div:nth-child(${index + 1})`)
            .contains(name)
            .should('be.visible');
    });
};

export const getFacet = name => cy.get('.facets .facet-item').contains(name);

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

export const clearFacet = value => {
    cy.get('.applied-facet-container')
        .contains(value)
        .parent()
        .find('svg')
        .click();
    waitForLoading();
};

export const checkFacetsItem = (name, facets) => {
    const facetValueItems = getFacet(name)
        .parentsUntil('.facet-list > div')
        .last()
        .next() // .facet-value-list next to the .facet-item
        .find('.facet-value-item');

    facetValueItems.each((facetValueItem, index) => {
        cy.wrap(facetValueItem)
            .contains(facets[index])
            .should('exist');
    });
};

export const sortFacet = (name, sortName) => {
    getFacet(name)
        .get(`.sort_${sortName}`)
        .click();
    cy.wait(500);
};

export const checkMoreCount = (count, total) => {
    cy.get('.load-more')
        .scrollIntoView()
        .contains(count)
        .should('be.visible')
        .contains(total)
        .should('be.visible');
};
