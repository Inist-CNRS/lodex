export const openAdvancedDrawer = () => {
    cy.get('.drawer').should('exist');

    cy.get('nav div')
        .contains('More')
        .click();

    cy.wait(300);
    cy.get('.drawer .advanced-page').should('be.visible');
};

export const goToAdminDashboard = () => {
    cy.get('.advanced-page a')
        .contains('Admin')
        .click();
    cy.location('pathname').should('equal', '/admin');
};

export const openChartDrawer = () => {
    cy.get('nav div')
        .contains('Graphs')
        .click();
    cy.get('.graph-summary').should('be.visible');
};

export const clickOnChart = name => {
    cy.get('.graph-link')
        .contains(name)
        .click();
    cy.wait(500);
};

export const goToChart = name => {
    clickOnChart(name);
    cy.get('.loading').should('not.be.visible');
    cy.get('.graph .title')
        .contains(name)
        .should('be.visible');
};

export const openSearchDrawer = () => {
    cy.get('.drawer').should('exist');

    cy.get('nav div')
        .contains('Search')
        .click();

    cy.wait(300);
    cy.get('.drawer .search .search-header').should('be.visible');
};

export const closeSearchDrawer = () => {
    cy.get('.drawer').should('exist');
    cy.get('.drawer .search .search-header')
        .scrollIntoView()
        .should('be.visible');

    cy.get('nav div')
        .contains('Search')
        .click();

    cy.wait(300);
};

export const signOut = () => {
    cy.get('.advanced-page a')
        .contains('Sign out')
        .click();
    cy.location('pathname').should('equal', '/login');
};

export const goToHomePage = () => {
    cy.visit('http://localhost:3000');
};
