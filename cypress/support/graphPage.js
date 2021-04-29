export const getStats = () => cy.get('.stats');

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

export const getSearchInput = () =>
    cy.get('.dataset-searchbar input[type=text]');

export const waitForLoading = () => {
    // This is the best way to wait for the loading to disappear so far
    // Because sometimes the loading doesn't appear at all
    cy.wait(500);
    cy.get('.graph-page .loading').should('not.exist');
};

export const searchFor = text => {
    getSearchInput().type(text);
    waitForLoading();
};

export const getFacet = name => cy.get('.facet-item').contains(name);
export const getExpandedFacet = name =>
    cy.get('.facet-item').contains('span', name);

export const getFacetItem = (name, value) =>
    getExpandedFacet(name)
        .next()
        .contains('span', value)
        .parent();

export const getFacetExcludeItem = name =>
    getExpandedFacet(name)
        .parent()
        .find('.facet-value-list .exclude-facet');

export const setFacet = (name, value) => {
    getFacet(name).click();
    cy.wait(1000);
    getFacetItem(name, value).click();
    waitForLoading();
    getFacet(name).click();
};

export const setFacetExclude = name => {
    getFacet(name).click();
    getFacetExcludeItem(name).click();
    waitForLoading();
    getFacet(name).click();
};

export const browseResults = () => {
    cy.get('.browse-result').click();
    cy.wait(500);
};

export const clearSearch = () =>
    cy.get('.dataset-searchbar button.searchbar-clear').click();
