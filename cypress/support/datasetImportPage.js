import { fillInputWithFixture } from './forms';
import * as adminNavigation from './adminNavigation';

export const openImport = () => {
    adminNavigation.goToData();
    cy.location('pathname').should('equal', '/data/existing');
};

export const importDataset = (filename, mimeType = 'text/csv') => {
    addFile(filename, mimeType);

    cy.get('.progress-container', { timeout: 2500 }).should('be.visible');
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
    cy.get('.progress-container', { timeout: 2500 }).should('be.visible');
    cy.get('[role="grid"]', { timeout: 6000 }).should('exist');
};

export const importMoreDataset = (filename, mimeType = 'text/csv') => {
    cy.contains('Add more').click({ force: true });

    fillInputWithFixture('input[type=file]', filename, mimeType);
    cy.wait(300);
    selectLoader();

    cy.get('.btn-upload-dataset').click({ force: true });
    cy.get('#confirm-upload', { timeout: 3000 }).should('be.visible');
    cy.wait(300);
    cy.contains('Accept').click({ force: true });
    cy.get('[aria-label="unpublish"]', { timeout: 2000 }).should('be.visible');
};

export const fillTabDisplayFormat = (format, save = true) => {
    cy.get('[data-testid="open-format-catalog"]').click();
    cy.get(`li[data-value="${format}"]`).click();
    const editDialog = cy.get('#format-edit-dialog');
    editDialog.should('be.visible');
    if (save) {
        editDialog.contains('confirm', { matchCase: false }).click();
    }
};

export const fillSyndication = (syndication, columnName) => {
    cy.get('.sidebar')
        .contains('Search & Facet')
        .click();
    cy.get(
        `[data-testid="autocomplete_search_syndication_${syndication}"]`,
    ).click();
    cy.get('[role="listbox"]')
        .contains(columnName)
        .click({ force: true });
};

export const addColumn = (columnName, options = {}) => {
    const name = columnName.replaceAll(' ', '-');
    cy.get(`[data-testid="add-field-dropdown"]`).click();
    cy.contains('From a column').click();
    cy.get(
        ['.btn-excerpt-add-column', `.btn-excerpt-add-column-${name}`].join(''),
        { timeout: 2000 },
    ).click();

    if (options.composedOf && options.composedOf.length > 1) {
        cy.contains('Existing Column(s)').click();
        cy.get('[data-testid="source-value-from-columns"]').click();

        options.composedOf.map(value => {
            if (value !== columnName) {
                cy.get('[role="listbox"]')
                    .contains(value)
                    .click();
            }
        });
    }

    if (options.display) {
        cy.get('#tab-display').click();
        const { format } = options.display;

        if (format) {
            fillTabDisplayFormat(format);
        }
    }

    cy.get('.btn-save').click();
    cy.get('.wizard').should('not.exist');

    cy.wait(1000);

    if (options.searchable) {
        cy.get('.sidebar')
            .contains('Search & Facet')
            .click();
        cy.get('[data-testid="autocomplete_search_in_fields"]').click();
        cy.get('[role="listbox"]')
            .contains(columnName)
            .click();
    }

    if (options.syndication) {
        fillSyndication(options.syndication, columnName);
    }
};

export const setOperationTypeInWizard = (value = 'DEFAULT') => {
    cy.get('.wizard', { timeout: 5000 }).should('be.visible');
    cy.wait(1000);
    cy.get('[aria-label="transformer-edit-transformers[0]').click();
    cy.get('[aria-label="Select an operation"]').click();
    cy.contains(value).click();
    cy.contains('confirm').click();
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
    cy.location('pathname').should('equal', '/instance/lodex_test');
};

export const goToModel = () => {
    adminNavigation.goToDisplay();

    cy.get('button')
        .contains('add characteristic')
        .should('be.visible');
};

export const importModel = (filename, mimeType = 'application/json') => {
    adminNavigation.goToDisplay();
    cy.get('[aria-label="Open menu"]').click();
    cy.contains('Model').trigger('mouseover');
    cy.contains('Import a model').click();
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
