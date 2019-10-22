export const checkYears = years => {
    years.forEach((year, index) => {
        cy.get(`li:nth-child(${index + 1})>.istex-fold`)
            .contains(year)
            .should('be.visible');
    });
};

export const openFold = label => {
    cy.get(`.istex-fold button`)
        .contains(label)
        .click();

    cy.get('circle').should('not.exist');
};

export const checkVolumes = (year, volumes) => {
    const yearFold = cy
        .get(`li>.istex-fold`)
        .contains(year)
        .parentsUntil('.istex-fold');
    volumes.forEach((volume, index) => {
        yearFold
            .get(`li:nth-child(${index + 1}) .istex-fold`)
            .contains(`Volume: ${volume}`)
            .should('be.visible');
    });
};

export const checkIssues = (year, volume, issues) => {
    const volumeFold = cy
        .get('li>.istex-fold')
        .contains(year)
        .parentsUntil('.istex-fold')
        .get('.istex-fold')
        .contains(`Volume: ${volume}`)
        .parentsUntil('.istex-fold');
    issues.forEach((issue, index) => {
        volumeFold
            .get(`li:nth-child(${index + 1}) .istex-fold`)
            .contains(`Issue: ${issue}`)
            .should('be.visible');
    });
};

export const checkDocuments = (year, volume, issue, documentTitles) => {
    const issueFold = cy
        .get('li>.istex-fold')
        .contains(year)
        .parentsUntil('.istex-fold')
        .get('.istex-fold')
        .contains(`Volume: ${volume}`)
        .parentsUntil('.istex-fold')
        .get('.istex-fold')
        .contains(`Issue: ${issue}`)
        .parentsUntil('.istex-fold');

    documentTitles.forEach(title => {
        issueFold
            .get(`li .istex-fold a`)
            .contains(title)
            .scrollIntoView()
            .should('be.visible');
    });
};

export const loadMore = () => {
    cy.get('.load-more')
        .contains('View more results (1)')
        .click();
    cy.get('.load-more svg').should('not.exist');
};

export const openConfigure = () => {
    cy.get('.format_istexSummary .configure-field').click();
    cy.get('.configure-field.save').should('be.visible');
};

export const saveConfiguration = () => {
    cy.get('.configure-field.save').click();
    cy.get('.configure-field.save').should('not.be.visible');
};

export const configureYearSort = dir => {
    cy.get('.year_sort_dir button')
        .scrollIntoView()
        .click();
    cy.get('span[role="menuitem"]')
        .contains(dir)
        .click();
};

export const configureYearThreshold = value => {
    cy.get('.year_threshold input')
        .scrollIntoView()
        .clear()
        .type(value);
};

export const openEmbedDialog = () => {
    cy.get('.istex-summary .embed-button').click();
};
