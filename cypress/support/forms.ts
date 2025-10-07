export const fillInputWithFixture = (selector, filename, mimeType) => {
    cy.fixture(filename)
        .as('data')
        .get(selector, { timeout: 6000 })
        .then(function (element) {
            const dataString =
                typeof this.data === 'string'
                    ? this.data
                    : JSON.stringify(this.data);
            const blob = new Blob([dataString], { type: mimeType });
            const file = new File([blob], filename, { type: mimeType });
            const dataTransfer = new DataTransfer();

            dataTransfer.items.add(file);
            element[0].files = dataTransfer.files;
            return cy.wrap(element[0]).trigger('change', { force: true }); // https://github.com/cypress-io/cypress/issues/3730
        });
};
