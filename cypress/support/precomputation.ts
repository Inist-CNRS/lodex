export const setPrecomputationName = (name: string) => {
    cy.findByLabelText('Name *').clear().type(name);
};

export const setPrecomputationUrl = (url: string) => {
    cy.findByLabelText('Web service URL *').clear().type(url);
};

export const setPrecomputationSourceColumns = (columns: string[]) => {
    cy.findByLabelText('Source column(s) *').click();
    columns.forEach((column) => {
        cy.findByRole('option', { name: column }).click();
    });
    cy.findAllByLabelText('Source column(s) *').eq(0).click();
};

export const fillPrecomputationForm = ({
    name,
    url,
    sourceColumns,
}: {
    name: string;
    url: string;
    sourceColumns: string[];
}) => {
    setPrecomputationName(name);
    setPrecomputationUrl(url);
    setPrecomputationSourceColumns(sourceColumns);
};

export const checkPrecomputationFormValues = ({
    name,
    url,
    sourceColumns,
    status,
}: {
    name: string;
    url: string;
    sourceColumns: string[];
    status: string;
}) => {
    cy.findByLabelText('Name *').should('have.value', name);
    cy.findByLabelText('Web service URL *').should('have.value', url);
    cy.contains('Status : ')
        .parent()
        .should('contain', status, { timeout: 10000 });
    sourceColumns.forEach((column) => {
        cy.findByLabelText('Source column(s) *')
            .parent()
            .should('contain', column);
    });
};

export const createPrecomputation = ({
    name,
    url,
    sourceColumns,
}: {
    name: string;
    url: string;
    sourceColumns: string[];
}) => {
    cy.findByLabelText('Add more precomputed data').click();
    fillPrecomputationForm({ name, url, sourceColumns });
    cy.findByRole('button', { name: 'Save' }).click();
    cy.contains('Precomputed data added successfully').should('be.visible');
};

export const importPrecomputationResults = ({
    filePath,
}: {
    filePath: string;
}) => {
    cy.findByText('Import').click();
    cy.get('input[type="file"]').attachFile(filePath);
    cy.findByRole('button', { name: 'Import' }).click();
    cy.contains('Import completed successfully').should('be.visible');
};

export const importPrecomputationResultsWithDialog = ({
    filePath,
}: {
    filePath: string;
}) => {
    cy.findByText('Import').click();
    cy.contains('Import Precomputed results').should('be.visible');
    cy.contains('Warning: this will overwrite the current results').should(
        'be.visible',
    );
    cy.get('input[type="file"]').attachFile(filePath);
    cy.findByRole('button', { name: 'Import' }).click();
    cy.contains('Import completed successfully').should('be.visible');
};

export const exportPrecomputationResults = () => {
    cy.findByText('Download data').click();
};
