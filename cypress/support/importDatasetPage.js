export const openImportModal = () => {
    cy.get('.upload.admin button').click();
};

export const fillDatasetFileInput = async (
    filename = 'data.csv',
    mimeType = 'text/csv',
) => {
    cy
        .fixture(filename)
        .as('dataset')
        .get('.btn-upload-dataset input[type=file]')
        .last() // There is two inputs, but I don't know why!
        .then(function(element) {
            const blob = new Blob([this.dataset], { type: mimeType });
            const file = new File([blob], filename, { type: mimeType });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            element[0].files = dataTransfer.files;
        });
};
