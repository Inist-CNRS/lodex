export const searchInput = () =>
    cy.get('.search .search-searchbar input[type="text"]');

export const search = (value) => {
    cy.get('.search .search-searchbar').scrollIntoView().should('be.visible');
    searchInput().type(value);
    cy.wait(500); // Wait for the debounce
};

export const filterShowResourcesIAnnotated = () => {
    cy.findByLabelText('Annotations').click();
    cy.findByRole('option', {
        name: 'Resources that I have annotated',
    }).click();
};
export const filterShowResourcesIHaveNotAnnotated = () => {
    cy.findByLabelText('Annotations').click();
    cy.findByRole('option', {
        name: 'Resources that I have not annotated',
    }).click();
};
export const filterClearMyAnnotationsFilter = () => {
    cy.findByLabelText('Annotations').click();
    cy.findByRole('option', { name: 'All resources' }).click();
};

export const filterShowVisitedResources = () => {
    cy.findByLabelText('Visited resources').click();
    cy.findByRole('option', {
        name: 'I have already seen',
    }).click();
};

export const filterShowUnVisitedResources = () => {
    cy.findByLabelText('Visited resources').click();
    cy.findByRole('option', {
        name: 'I did not see',
    }).click();
};

export const clearSearch = () =>
    cy.get('.search .search-searchbar button.searchbar-clear').click();

export const findSearchResultByTitle = (value) =>
    cy
        .get('.search .search-result-title')
        .contains(value)
        .should('be.visible')
        .parent();

export const checkResultList = (titles) => {
    titles.forEach((title, index) => {
        cy.get(
            `.search .search-result-link:nth-child(${
                index + 1
            }) .search-result-title`,
        )
            .contains(title)
            .scrollIntoView()
            .should('be.visible');
    });
};

export const loadMore = () => {
    cy.get('.search .load-more button').scrollIntoView().click();
};

export const waitForLoading = () => {
    // This is the best way to wait for the loading to disappear so far
    // Because sometimes the loading doesn't appear at all
    cy.wait(1000);
    cy.get('.search .load-more .search-loading').should('not.exist');
};

export const getFacetsOrder = (facets) => {
    facets.forEach((name, index) => {
        cy.get(`.search .search-facets > li:nth-child(${index + 1})`)
            .contains(name)
            .should('be.visible');
    });
};

export const getFacet = (name) =>
    cy.get('.search .search-facets .facet-item').contains('span', name);

export const getFacetItem = (name, value) =>
    getFacet(name).parent().contains('span', value).parent();

export const getFacetExcludeItem = (name) =>
    getFacet(name).next().find('.facet-value-list .exclude-facet');

export const setFacet = (name, value) => {
    getFacet(name).click();
    getFacetItem(name, value).click();
    waitForLoading();
};

export const clearFacet = (value) => {
    cy.get('.search .applied-facet-container')
        .contains(value)
        .parent()
        .parent()
        .find('svg')
        .click();
    waitForLoading();
};

export const checkFacetsItem = (name, facets) => {
    const facetValueItems = getFacet(name).next().find('.facet-value-item');

    facetValueItems.each((facetValueItem, index) => {
        cy.wrap(facetValueItem).contains('span', facets[index]).should('exist');
    });
};

export const sortFacet = (name, sortName) => {
    getFacet(name).get(`.sort_${sortName}`).first().click();
    cy.wait(1000);
};

export const filterFacet = (name, filter) => {
    getFacet(name).get(`input[placeholder$="${name}"`).type(filter);
    cy.wait(1000);
};

export const checkMoreResultsExist = () => {
    cy.get('.search .load-more button').should('exist');
};

export const checkMoreResultsNotExist = () => {
    cy.get('.search .load-more button').should('not.exist');
};

export const checkMoreResultsCount = (count, total) => {
    cy.get('.search .load-more button')
        .scrollIntoView()
        .should('be.visible')
        .contains(`${count} / ${total}`);
};

export const checkStatsCount = (current, count) => {
    cy.get('.search .stats')
        .contains(`Found ${current} on ${count}`)
        .should('be.visible');
};

export const checkResultsCount = (count) => {
    cy.get('.search .search-result').should('have.length', count);
};

export const goToResourceNumber = (nb) => {
    cy.get(
        `.search .search-result-list-container > a:nth-child(${nb}) .search-result`,
    ).click();
    cy.location('pathname').should('not.equal', '/');
};
