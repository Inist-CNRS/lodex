export const fillSubcategoryFormAndSubmit = values => {
    Object.keys(values).forEach(key => {
        cy.get(`input[name="${key}"]`).type(values[key]);
    });

    cy.get('button[type="submit"]').click();
};
