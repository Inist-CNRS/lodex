import { fillInputWithFixture } from './forms';

export const openImportDialog = () => {
    cy.get('.upload.admin button').click();
};

export const importDataset = (filename, mimeType = 'text/csv') => {
    openImportDialog();
    fillInputWithFixture(
        '.btn-upload-dataset input[type=file]',
        filename,
        mimeType,
    );

    cy.get('.progress').should('exist');
    cy.wait(300);
    cy.get('.progress').should('not.exist');
    cy.get('tbody').should('exist');
};

export const importMoreDataset = (filename, mimeType = 'text/csv') => {
    cy.get('.appbar button.open-upload').click();
    fillInputWithFixture(
        '.btn-upload-dataset input[type=file]',
        filename,
        mimeType,
    );

    cy.get('.data-published a')
        .contains('Go to my published data')
        .should('be.visible');
};

const fillStepValueConcatColumn = (value, index) => {
    cy.get(`#select-column-${index}`).click();
    cy.get('[role="listbox"]')
        .contains(value)
        .click();
};

const fillStepDisplayFormat = format => {
    cy.get('#step-value-format .select-format').click();
    cy.get(`[role="listbox"] li[data-value="${format}"]`).click();
};

export const addColumn = (columnName, options = {}) => {
    const name = columnName.replace(' ', '-');
    cy.get('button.btn-add-column').click();
    cy.get('button.btn-add-column-from-dataset').click();
    cy.get(
        ['.btn-excerpt-add-column', `.btn-excerpt-add-column-${name}`].join(''),
    ).click();

    if (options.composedOf && options.composedOf.length > 1) {
        cy.get('#step-value')
            .click()
            .scrollIntoView();
        cy.get('#step-value-concat input[value="concat"]').click();

        options.composedOf.forEach(fillStepValueConcatColumn);
    }

    if (options.display) {
        cy.get('#step-display').click();
        const { format } = options.display;

        if (format) {
            fillStepDisplayFormat(format);
        }
    }

    cy.get('.btn-save').click();
    cy.get('.wizard').should('not.exist');
};

export const setUriColumnValue = (value = 'generate') => {
    cy.get('.publication-excerpt .publication-excerpt-column-uri')
        .trigger('mouseover')
        .click();
    cy.get('.wizard', { timeout: 2000 }).should('be.visible');
    cy.get(`.radio_generate input[value="${value}"]`).click();
    cy.get('.btn-save').click();
    cy.get('.wizard').should('not.exist');
};

export const setOperationTypeInWizard = (value = 'DEFAULT') => {
    cy.get('.wizard', { timeout: 2000 }).should('be.visible');
    cy.contains('Transformations applied on the value').click();
    cy.get('.operation').click();
    cy.contains(value).click();
    cy.get('.btn-save').click();
    cy.get('.wizard').should('not.exist');
};

export const publish = () => {
    cy.get('.btn-publish button').click();
    cy.get('.data-published').should('be.visible');
};

export const goToPublishedResources = () => {
    cy.get('.data-published a')
        .contains('Go to my published data')
        .click();
    cy.location('pathname').should('equal', '/');
};

export const goToModel = () => {
    cy.get('.appbar a[href="#/ontology"]').click();
    cy.location('hash').should('equal', '#/ontology');
};

export const importModel = (filename, mimeType = 'application/json') => {
    cy.get('button.btn-import-fields').click();
    fillInputWithFixture('input[name="file_model"]', filename, mimeType);
};

const checkParserItem = label => {
    cy.get('li[role=option]')
        .contains(label)
        .scrollIntoView()
        .should('be.visible');
};

export const checkListOfSupportedFileFormats = () => {
    cy.get('div')
        .contains('AUTO')
        .click({ force: true });
    cy.wait(300);
    cy.get('li[role=option]').should('have.length', 20);
    checkParserItem('CSV - with semicolon');
    checkParserItem('XML - TEI document');
    checkParserItem('ZIP file from dl.istex.fr');
    checkParserItem('JSON - from Lodex API');
    checkParserItem('XML - ATOM feed');
};
