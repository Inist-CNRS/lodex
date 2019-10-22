import { getDialogTitle, getDialogContent, getDialogActions } from './dialog';

export const openCreateResourceForm = () => {
    cy.get('.create-resource button')
        .should('exist')
        .click();

    cy.wait(300);

    getDialogTitle().contains('Add a new resource to the dataset');
};

export const fillResourceFormInput = (inputName, inputValue) => {
    getDialogContent()
        .find(`input[name="${inputName}"]`)
        .type(inputValue);
};

export const saveResourceForm = () => {
    getDialogActions()
        .find('button')
        .first()
        .contains('Save')
        .click();

    cy.wait(300);
};

export const checkResourceField = (fieldName, fieldValue) => {
    const fieldValueClass = fieldName.toLowerCase();
    cy.get(`.property_value.${fieldValueClass}`)
        .should('exist')
        .contains(fieldValue);
};
