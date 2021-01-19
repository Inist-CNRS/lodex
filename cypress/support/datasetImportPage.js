import { fillInputWithFixture } from './forms';
import * as adminNavigation from './adminNavigation';

export const openImport = () => {
    adminNavigation.goToData();
    cy.location('pathname').should('equal', '/data/existing');
};

export const importDataset = (filename, mimeType = 'text/csv') => {
    fillInputWithFixture('input[type=file]', filename, mimeType);
    cy.wait(300);
    cy.get('.btn-upload-dataset').click({ force: true });

    cy.get('.progress').should('exist');
    cy.wait(300);
    cy.get('.progress', { timeout: 3000 }).should('not.exist');
    cy.get('tbody').should('exist');
};

export const importMoreDataset = (filename, mimeType = 'text/csv') => {
    cy.get('.sidebar')
        .contains('Add more')
        .click({ force: true });

    fillInputWithFixture('input[type=file]', filename, mimeType);
    cy.wait(300);
    cy.get('.btn-upload-dataset').click({ force: true });

    cy.get('.progress').should('exist');
    cy.wait(300);
    cy.get('.progress').should('not.exist');

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

export const fillStepDisplayFormat = format => {
    cy.get('#step-value-format .select-format')
        .first()
        .click();
    cy.get(`[role="listbox"] li[data-value="${format}"]`).click();
};

export const fillStepDisplaySyndication = syndication => {
    cy.get('.field-overview').click();
    cy.get(`[role="listbox"] li[data-value="${syndication}"]`).click();
};

export const addColumn = (columnName, options = {}) => {
    const name = columnName.replace(' ', '-');
    cy.get('button.btn-add-field-from-dataset').click();
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
        const { format, syndication } = options.display;

        if (format) {
            fillStepDisplayFormat(format);
        }

        if (syndication) {
            fillStepDisplaySyndication(1);
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
    cy.get(`.radio_generate input[value="${value}"]`).click({ force: true });
    cy.get('.btn-save').click();
    cy.get('.wizard').should('not.exist');
};

export const setOperationTypeInWizard = (value = 'DEFAULT') => {
    cy.get('.wizard', { timeout: 5000 }).should('be.visible');
    cy.contains('Transformations applied on the value').click();
    cy.get('.wizard', { timeout: 5000 }).should('be.visible');
    cy.get('.operation').click();
    cy.contains(value).click();
    cy.get('.btn-save').click();
    cy.get('.wizard').should('not.exist');
};

export const publish = () => {
    cy.get('.btn-publish button').click();
    adminNavigation.goToData();
    cy.get('.data-published').should('be.visible');
};

export const goToPublishedResources = () => {
    cy.get('.data-published a')
        .contains('Go to my published data')
        .click();
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
    cy.get('div')
        .contains('AUTO')
        .click({ force: true });
    cy.wait(500);
    cy.get('li>div>span').should('have.length', 21);
    cy.get('button.format-category').should('have.length', 6);
    checkLoaderItem('CSV - with semicolon');
    checkLoaderItem('XML - TEI document');
    checkLoaderItem('ZIP - file from dl.istex.fr');
    checkLoaderItem('JSON - from Lodex API');
    checkLoaderItem('XML - ATOM feed');
    cy.get('button')
        .contains('Cancel')
        .click({ force: true });
};

export const checkListOfFiltererFileFormats = () => {
    cy.get('div')
        .contains('AUTO')
        .click({ force: true });
    cy.wait(500);
    cy.get('button')
        .contains('TSV')
        .click();
    cy.get('li>div>span').should('have.length', 4);
    cy.get('button')
        .contains('Cancel')
        .click({ force: true });
};
