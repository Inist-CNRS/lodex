export const checkYears = years => {
    years.forEach((year, index) => {
        cy
            .get(`.istex-year>li:nth-child(${index + 1})>.istex-fold`)
            .contains(year)
            .should('be.visible');
    });
};

export const openFold = label => {
    cy
        .get(`.istex-fold button`)
        .contains(label)
        .click();

    cy.get('circle').should('not.exist');
};

export const checkVolumes = (year, volumes) => {
    const yearFold = cy
        .get(`.istex-year>li>.istex-fold`)
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
        .get('.istex-year>li>.istex-fold')
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
        .get('.istex-year>li>.istex-fold')
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
