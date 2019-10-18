import { getModalTitle, getModalContent, getModalActions } from './modal';

export const openCreateResourceForm = () => {
    cy.get('.create-resource button')
        .should('exist')
        .click();

    cy.wait(300);

    getModalTitle().contains('Add a new resource to the dataset');
};

export const fillResourceFormInput = (inputName, inputValue) => {
    getModalContent()
        .find(`input[name="${inputName}"]`)
        .type(inputValue);
};

export const saveResourceForm = () => {
    getModalActions()
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
