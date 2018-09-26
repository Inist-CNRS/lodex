import { fillInputWithFixture } from './forms';

export const openImportModal = () => {
    cy.get('.upload.admin button').click();
};

const defaultExpectedData = ['Row 1', 'Test 1', 'Row 2', 'Test 2'];

export const importDataset = (
    filename,
    mimeType = 'text/csv',
    expectedData = defaultExpectedData,
) => {
    openImportModal();
    fillInputWithFixture(
        '.btn-upload-dataset input[type=file]',
        filename,
        mimeType,
    );

    cy.get('tbody').should('have.text', expectedData.join(''));
};

export const addColumn = columnName => {
    const name = columnName.replace(' ', '-');
    cy.get('.btn-add-column button').click();
    cy.get('.btn-add-column-from-dataset button').click();
    cy
        .get(
            [
                '.btn-excerpt-add-column',
                `.btn-excerpt-add-column-${name}`,
                ' ',
                'button',
            ].join(''),
        )
        .click();
    cy.get('.btn-save').click();
    cy.get('.wizard').should('not.exist');
};

export const setUriColumnValue = (value = 'generate') => {
    cy
        .get('.publication-excerpt .publication-excerpt-column-uri')
        .trigger('mouseover')
        .click();
    cy.get('.wizard', { timeout: 2000 }).should('be.visible');
    cy.get(`.radio_generate input[value="${value}"]`).click();
    cy.get('.btn-save').click();
    cy.get('.wizard').should('not.exist');
};

export const publish = () => {
    cy.get('.btn-publish button').click();
    cy.get('.data-published').should('be.visible');
};

export const goToPublishedResources = () => {
    cy.get('.data-published a[href="/"]').click();
    cy.location('pathname').should('equal', '/');
};

export const importModel = (filename, mimeType = 'application/json') => {
    cy.get('button.btn-import-fields').click();
    fillInputWithFixture('input[name="file_model"]', filename, mimeType);
};
