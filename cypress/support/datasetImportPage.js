import { fillInputWithFixture } from './forms';
import * as adminNavigation from './adminNavigation';

export const openImport = () => {
    adminNavigation.goToData();
    cy.location('pathname').should('equal', '/data/existing');
};

export const importDataset = (filename, mimeType = 'text/csv') => {
    addFile(filename, mimeType);

    cy.get('.progress-container', { timeout: 500 }).should('be.visible');
    cy.wait(300);
    cy.get('[role="grid"]', { timeout: 6000 }).should('exist');
};

export const importOtherDataset = (filename, mimeType = 'text/csv') => {
    fillInputWithFixture('input[type=file]', filename, mimeType);
    cy.wait(300);
    selectLoader();
    cy.get('.btn-upload-dataset').should('be.enabled');
    cy.get('.btn-upload-dataset').click({ force: true });
    cy.get('#confirm-upload', { timeout: 3000 }).should('be.visible');
    cy.wait(300);
    cy.contains('Accept').click({ force: true });
    cy.get('.progress-container', { timeout: 500 }).should('be.visible');
    cy.get('[role="grid"]', { timeout: 6000 }).should('exist');
};

export const importMoreDataset = (filename, mimeType = 'text/csv') => {
    cy.get('.sidebar')
        .contains('Add more')
        .click({ force: true });

    fillInputWithFixture('input[type=file]', filename, mimeType);
    cy.wait(300);
    selectLoader();

    cy.get('.btn-upload-dataset').click({ force: true });
    cy.get('#confirm-upload', { timeout: 3000 }).should('be.visible');
    cy.wait(300);
    cy.contains('Accept').click({ force: true });
    cy.get('[aria-label="unpublish"]', { timeout: 2000 }).should('be.visible');
};

const fillTabValueConcatColumn = (value, index) => {
    cy.get(`#select-column-${index}`).click();
    cy.get('[role="listbox"]')
        .contains(value)
        .click();
};

export const fillTabDisplayFormat = format => {
    cy.get('#step-value-format .select-format')
        .first()
        .click();
    cy.get(`[role="listbox"] li[data-value="${format}"]`).click();
};

export const fillTabDisplaySyndication = syndication => {
    cy.get('.field-overview').click();
    cy.get(`[role="listbox"] li[data-value="${syndication}"]`).click();
};

export const addColumn = (columnName, options = {}) => {
    const name = columnName.replaceAll(' ', '-');
    cy.get('button.btn-add-field-from-dataset').click({ force: true });
    cy.get(
        ['.btn-excerpt-add-column', `.btn-excerpt-add-column-${name}`].join(''),
        { timeout: 2000 },
    ).click();

    if (options.composedOf && options.composedOf.length > 1) {
        cy.get('#tab-value').click();
        cy.get('#tab-value-concat input[value="concat"]').click();

        options.composedOf.forEach(fillTabValueConcatColumn);
    }

    if (options.display) {
        cy.get('#tab-display').click();
        const { format, syndication } = options.display;

        if (format) {
            fillTabDisplayFormat(format);
        }

        if (syndication) {
            fillTabDisplaySyndication(1);
        }
    }

    if (options.searchable) {
        cy.get('#tab-search').click();

        cy.contains(
            'Searchable - global full text search will target this field',
        ).click();
    }

    cy.get('.btn-save').click();
    cy.get('.wizard').should('not.exist');
};

export const setOperationTypeInWizard = (value = 'DEFAULT') => {
    cy.get('.wizard', { timeout: 5000 }).should('be.visible');
    cy.contains('Transformation').click();
    cy.get('.wizard', { timeout: 5000 }).should('be.visible');
    cy.get('.operation').click();
    cy.contains(value).click();
    cy.get('.btn-save').click();
    cy.get('.wizard').should('not.exist');
};

export const publish = () => {
    cy.get('.btn-publish button').click();
    adminNavigation.goToData();
    cy.get('[aria-label="unpublish"]', { timeout: 2000 }).should('be.visible');
};

export const goToPublishedResources = () => {
    cy.get('.go-published-button', { timeout: 1000 }).click();
    cy.location('pathname').should('equal', '/');
};

export const goToModel = () => {
    adminNavigation.goToDisplay();

    cy.get('button')
        .contains('add characteristic')
        .should('be.visible');
};

export const importModel = (filename, mimeType = 'application/json') => {
    adminNavigation.goToDisplay();
    cy.get('button.btn-import-fields').click();
    fillInputWithFixture('input[name="file_model"]', filename, mimeType);
    cy.wait(300);
};

const checkLoaderItem = label => {
    cy.get('li>div')
        .contains(label)
        .scrollIntoView()
        .should('be.visible');
};

export const checkListOfSupportedFileFormats = () => {
    cy.get('.open-loaders').click({ force: true });
    cy.wait(500);
    cy.get('button.format-category').should('have.length', 6);
    checkLoaderItem('CSV - with semicolon');
    checkLoaderItem('XML - TEI document');
    checkLoaderItem('JSON - from Lodex API');
    checkLoaderItem('XML - ATOM feed');
    cy.get('button')
        .contains('Cancel')
        .click({ force: true });
};

export const checkListOfFiltererFileFormats = () => {
    cy.get('.open-loaders').click({ force: true });
    cy.wait(500);
    cy.get('button')
        .contains('TSV')
        .click();
    cy.get('li>div>span').should('have.length', 4);
    cy.get('button')
        .contains('Cancel')
        .click({ force: true });
};
export const addFile = (filename, mimeType = 'text/csv') => {
    fillInputWithFixture('input[type=file]', filename, mimeType);
    cy.wait(300);
    selectLoader();
    cy.get('.btn-upload-dataset').click({ force: true });
};
export const addFileWithoutClick = (filename, mimeType = 'text/csv') => {
    fillInputWithFixture('input[type=file]', filename, mimeType);
    cy.wait(300);
};

export const selectLoader = (loaderName = 'automatic') => {
    cy.get('.select-loader')
        .first()
        .click();
    cy.get(`[role="listbox"] li[data-value="${loaderName}"]`).click();
};
